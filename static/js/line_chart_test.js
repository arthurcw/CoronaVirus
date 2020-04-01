// Source of data
// const url = "http://127.0.0.1:5000/dataCovid19";
const url2 = "./Datasets/Covid19_20200327.csv";
// const selectDate = Date.parse("2020-03-25");
// const caseFieldName = "cases";     // field name of confirmed cases
// const deathFieldName = "deaths";    // field name of deaths
// Retrieve data from the CSV file and execute everything below
var svgWidth = 960;
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
var svg = d3.select("#timeSeriesPlot")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
var parseTime = d3.timeParse("%m/%d/%Y");
// Import Data
d3.csv(url2, function(data) {
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach( (d) => {
        d.date = parseTime(d.date);
        d.cases = +d.cases;
        d.death = +d.death;
    });
    data = data.filter((d) => {
        return d["country_region"] === "US" & d["admin2"] == "" & d["province_state"] == ""
    });

    console.log(data);
    // console.log(data);
    // Step 2: Create scale functions
    // ==============================
    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cases)])
        .range([height, 0]);
    // Step 3: Create the axes
    // =================================
    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%d-%b"));
    var leftAxis = d3.axisLeft(yLinearScale);
    // Configure a line function which will plot the x and y coordinates using our scales
    var drawLine = d3.line()    
    .x(d => xTimeScale(d.date))
    .y(d => yLinearScale(d.cases));
    // Append an SVG path and plot its points using the line function
    chartGroup.append("path")
        .attr("d", drawLine(data))
        .classed("line_1", true);
    // Append an SVG group element to the chartGroup, create the left axis inside of it
    chartGroup.append("g")
        .classed("axis", true)
        .call(leftAxis);
    // Append an SVG group element to the chartGroup, create the bottom axis inside of it
    // Translate the bottom axis to the bottom of the page
    chartGroup.append("g")
        .classed("axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    // d3.select("g").selectAll("path")
    //     .attr("fill", "none")
    //     .attr("stroke", "blue");
});