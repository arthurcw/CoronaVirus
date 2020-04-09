// Use D3 to plot cases over time
// Data source
const urlLineChart = "/api/Covid19ByCountry";

// SVG setting
var svgWidth = d3.select("main").node().getBoundingClientRect().width;
var svgHeight = 500;
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
// Append SVG element
var svg = d3.select("#timeSeriesPlot")
    .append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox','0 0 '+svgWidth+' '+svgHeight)
    .attr('preserveAspectRatio','xMinYMin');

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.json(urlLineChart).then(function (data, err) {
    if (err) throw err;

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data = data.countries;
    data.forEach((d) => {
        d.date = Date.parse(d.date);
        d.cases = +d.cases;
        d.death = +d.death;
    });

    // Step 2: selected countries
    // ==============================
    country_list = ["China", "US", "Italy", "Spain", "Germany", "Iran", "France"];
    color_list = ['#3623E6', '#E62923', '#4893CD', '#CD48B7', '#5F270F', '#D8B373', '#20945A'];
    caseNumber = [];
    data_country_all = [];

    // Step 3: Build axis and data series
    // ==============================

    for (i = 0; i < country_list.length; i++) {
        data_country = data.filter((d) => {
            return d["country_region"] === country_list[i]
        });

        maxNumberEach = d3.max(data_country, function (d) { return d.cases; });
        caseNumber = caseNumber.concat(maxNumberEach);
        maxNumber = d3.max(caseNumber);

        var xTimeScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, width])
            .nice();

        var yLinearScale_each = d3.scaleLinear()
            .domain([0, 180000])
            .range([height, 0])
            .nice();

        var bottomAxis = d3.axisBottom(xTimeScale)
            .tickSize(-height)
            .tickPadding(14);

        var yAxis = d3.axisLeft(yLinearScale_each)
            .tickSize(-width)
            .tickPadding(10);

        var yAxisLabel = 'Confirmed Cases Number';
        var yAxisG = chartGroup
            .append('g')
            .call(yAxis);
        yAxisG.selectAll('.domain').remove();

        yAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', -70)
            .attr('x', -height / 2)
            .attr('fill', 'black')
            .attr('transform', `rotate(-90)`)
            .attr('text-anchor', 'middle')
            .text(yAxisLabel);

        var xAxisLabel = 'Date';
        var xAxisG = chartGroup.append('g')
            .classed("x-axis", true)
            .attr('transform', `translate(0,${height})`)
            .call(bottomAxis);

        xAxisG.select('.domain').remove();

        xAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', 50)
            .attr('x', width / 2)
            .attr('fill', 'black')
            .text(xAxisLabel);

        var lineGenerator_each = d3.line()
            .x(function (d) { return xTimeScale(d.date); })
            .y(function (d) { return yLinearScale_each(d.cases); });

        chartGroup.append('path')
            .data([data_country])
            .attr("d", lineGenerator_each(data_country))
            .attr("fill", "none")
            .attr("stroke", color_list[i]);

        data_country_all = data_country_all.concat(data_country);

    }

    // Step 4: Add markers
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
            .data(data_country_all)
            .enter()
            .append("circle")
            .attr("cx", d => xTimeScale(d.date))
            .attr("cy", d => yLinearScale_each(d.cases))
            .attr("r", "2.5")
            .attr("fill", "gold")
            .attr("stroke-width", "1")
            .attr("stroke", "black");

    // Date formatter to display dates nicely
    var dateFormatter = d3.timeFormat("%d-%b");

    // Step 5: Tooltip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([70, -60])
        .html(function (d) {
            return (`<strong>${dateFormatter(d.date)}<strong><br>${d.country_region}<hr>${casesNumFormat(d.cases)}
                case(s) confirmed`);
        });
    chartGroup.call(toolTip);

    circlesGroup
        .on("mouseover", function (d) {
            toolTip.show(d, this);
        })
        .on("mouseout", function (d) {
            toolTip.hide(d);
        });
});