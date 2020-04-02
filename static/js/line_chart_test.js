const url5 = "./Datasets/Covid19_20200327.csv";
const deathnumber2 = "./Datasets/Covid19_20200327.csv";
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
// Append SVG element
var svg = d3.select("#timeSeriesPlotChina")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Import Data
d3.csv(url5, function (data) {
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    // Create a function to parse date and time
    var parseTime = d3.timeParse("%m/%d/%Y");

    data.forEach((d) => {
        d.date = parseTime(d.date);
        d.cases = +d.cases;
        d.death = +d.death;
    });

    // data1 = data.filter((d) => {
    //     return d["country_region"] === "China" & d["admin2"] == "" & d["province_state"] == ""
    // });
    // console.log(data1);

    // data2 = data.filter((d) => {
    //     return d["country_region"] === "US" & d["admin2"] == "" & d["province_state"] == ""
    // });
    // console.log(data2);

    country_list = ["China", "US", "Italy", "Spain", "Germany", "Iran", "France"];
    color_list = ['#3623E6', '#E62923', '#4893CD', '#CD48B7', '#5F270F', '#D8B373', '#20945A'];
    caseNumber = [];

    for (i = 0; i < country_list.length; i++) {
        data_country = data.filter((d) => {
            return d["country_region"] === country_list[i] & d["admin2"] == "" & d["province_state"] == ""
        });

        console.log(data_country);

        maxNumberEach = d3.max(data_country, function (d) { return d.cases; });
        caseNumber = caseNumber.concat(maxNumberEach);
        maxNumber = d3.max(caseNumber);

        // console.log(maxNumber);
        var xTimeScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

        var yLinearScale_each = d3.scaleLinear()
        .domain([0, 90000])
        .range([height, 0]);

        var bottomAxis = d3.axisBottom(xTimeScale)
        .tickSize(-height)
        .tickPadding(14);

        var yAxis = d3.axisLeft(yLinearScale_each)
        .tickSize(-width)
        .tickPadding(10);
    }

});