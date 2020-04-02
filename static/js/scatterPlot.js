// Source of data
const urlScatterPlots = "http://127.0.0.1:5000/dataLatestInfo";

function plotScatterHighCharts(loc, data, category, xScale, txtTitle, txtxAxis, txtyAxis) {
    // build data series
    var confirmedList = [];
    var deathList = [];
    data.forEach(d=> {
        if (d[category] != null & d[category] > 0 & d.cases > 0) {
            confirmedList.push([d[category], d.cases, d.country_region])
        }
        if (d[category] != null & d[category] > 0 & d.death > 0) {
            deathList.push([d[category], d.death, d.country_region])
        }
    })
    var confirmedCases = {};
    confirmedCases.name = 'Confirmed Cases';
    confirmedCases.color = 'rgba(223, 83, 83, .5)';
    confirmedCases.data = confirmedList;

    var deathCases = {};
    deathCases.name = 'Deaths'
    deathCases.color = 'rgba(119, 152, 191, .5)';
    deathCases.data = deathList;

    // Highcharts template
    Highcharts.chart(loc, {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: txtTitle
        },
        // subtitle: {
        //     text: 'Source: John Hopkins and New York Times'
        // },
        xAxis: {
            type: xScale,
            title: {
                enabled: true,
                text: txtxAxis,
                style: { fontSize: '15px' }
            },
            labels: { style: { fontSize: '15px' } }
        },
        yAxis: {
            type: 'logarithmic',
            title: {
                text: txtyAxis,
                style: { fontSize: '15px' }
            },
            labels: { style: { fontSize: '15px' } }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
            borderWidth: 1,
            itemStyle: { fontSize: '15px' }
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x:,.0f}, {point.y:,.0f}'
                }
            }
        },
        series: [confirmedCases, deathCases]
    });

}

function generateScatter(data) {
    console.log(data);
    // <fig> tag in index.html, dataset, x-axis, x-axis scale, chart title, x-axis title, y-axis title
    plotScatterHighCharts("popContainer", data, "population", "logarithmic", "Number of Cases vs Population", "Population", "Number of Cases");
    plotScatterHighCharts("ageContainer", data, "med_age", "linear", "Number of Cases vs Median Age", "Median Age", "Number of Cases");
    plotScatterHighCharts("gdpContainer", data, "gdp", "logarithmic", "Number of Cases vs per capita GDP", "per capita GDP ($)", "Number of Cases");
    plotScatterHighCharts("hcContainer", data, "health_exp", "linear", "Number of Cases vs Healthcare Expense", "Expense as % of GDP", "Number of Cases");

}

// Read data and run
d3.json(urlScatterPlots, generateScatter)
    .catch(function(error) { console.log(error); });


// SVG size
// var svgWidth = Math.min(500, window.innerWidth - 200);
// var svgHeight = 500;

// var margin = {
//     top: 20,
//     right: 40,
//     bottom: 100,
//     left: 100
// };

// var width = svgWidth - margin.left - margin.right;
// var height = svgHeight - margin.top - margin.bottom;

// // Create an SVG wrapper
// var svg = d3
//     .select("#popScatter")
//     .append("svg")
//     .attr("width", svgWidth)
//     .attr("height", svgHeight);

// // Append an SVG group, shift by left and top margins
// var chartGroup = svg.append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Initial X- and Y-axis Params
// var chosenXAxis = "cases";
// var chosenYAxis = "pop";

// /**
//  * function to update x or y scale var upon clicking on axis label
//  * @param {*} data - data
//  * @param {string} chosenAxis - data column name of clicked axis label
//  * @returns {} linearScale
//  */
// function axisScale(data, chosenAxis) {
//     let minFactor = 0.8;
//     let maxFactor = 1.2;

//     let scaleRange = [];
//     if (chosenAxis === "cases"|chosenAxis === "dealth") {
//         // x-axis
//         scaleRange = [0, width];
//     } else {
//         // y-axis
//         scaleRange = [height, 0];
//     };

//     let linearScale = d3.scaleLinear()
//         .domain([d3.min(data, d => d[chosenAxis]) * minFactor,
//             d3.max(data, d => d[chosenAxis]) * maxFactor
//         ])
//         .range(scaleRange);
//     return linearScale;
// };

// // function used for updating xAxis var upon click on axis label
// function renderXAxes(newXScale, xAxis) {
//   let bottomAxis = d3.axisBottom(newXScale);
//   xAxis.transition().duration(1000).call(bottomAxis);
//   return xAxis;
// }

// // function used for updating yAxis var upon click on axis label
// function renderYAxes(newYScale, yAxis) {
//     let leftAxis = d3.axisLeft(newYScale);
//     yAxis.transition().duration(1000).call(leftAxis);
//     return yAxis;
// }

// // function to move state texts/labels
// function updateStateTexts(dataLabel, axis, newScale, chosenAxis) {
//     dataLabel.transition()
//         .duration(1000)
//         .attr(axis, d => newScale(d[chosenAxis]));
//     return dataLabel;
// }

// // function used for updating circles group with a transition to new circles
// function renderCircles(circlesGroup, axis, newScale, chosenAxis) {
//     circlesGroup.transition()
//         .duration(1000)
//         .attr(axis, d => newScale(d[chosenAxis]));
//     return circlesGroup;
// }

// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

//     var xlabel;
//     var ylabel;
//     var xNumFormat;
//     var xlabelSuffix;

//     switch(chosenXAxis) {
//         case "cases":
//             xlabel = "Confirmed Cases:";
//             xNumFormat = d3.format(",.0f");
//             xlabelSuffix = "%";
//             break;
//         case "dealth":
//             xlabel = "# of Deaths:";
//             xNumFormat = d3.format(",.0f");
//             xlabelSuffix = "";
//     };

//     switch(chosenYAxis) {
//         case "pop":
//             ylabel = "Population:";
//             break;
//         case "gdp":
//             ylabel = "GDP:";
//             break;
//         case "health":
//             ylabel = "Healthcare Exp as % of GDP:";
//     };

//     var toolTip = d3.tip()
//         .attr("class", "d3-tip")
//         .offset([80, -60])
//         .html(function(d) {
//             return (`${d.state}<br>${xlabel} ${xNumFormat(d[chosenXAxis])}${xlabelSuffix}<br>${ylabel} ${d[chosenYAxis]}%`);
//     });

//     circlesGroup.call(toolTip);

//     circlesGroup
//         .on("mouseover", data => {
//             toolTip.show(data);
//         })
//         .on("mouseout", data => {
//             toolTip.hide(data);
//         });
//     return circlesGroup;
// }

// // Retrieve data from the CSV file and execute everything below
// d3.json(urlScatterCase, function(dataCOVID) {

//     d3.json(urlScatterPop, function(dataPop) { 

//     }


//     // parse data
//     data.forEach(function(d) {
//         d.poverty = +d.poverty;
//         d.age = +d.age;
//         d.income = +d.income;
//         d.healthcare = +d.healthcare;
//         d.obesity = +d.obesity;
//         d.smokes = +d.smokes;
//     });

//     // LinearScale function
//     var xLinearScale = axisScale(data, chosenXAxis);
//     var yLinearScale = axisScale(data, chosenYAxis);

//     // Create initial axis functions
//     var bottomAxis = d3.axisBottom(xLinearScale);
//     var leftAxis = d3.axisLeft(yLinearScale);

//     // append x axis
//     var xAxis = chartGroup.append("g")
//         .attr("transform", `translate(0, ${height})`)
//         .call(bottomAxis);

//     // append y axis
//     var yAxis = chartGroup.append("g")
//         .call(leftAxis);

//     // append initial circles
//     var circlesGroup = chartGroup.selectAll("circle")
//         .data(data)
//         .enter()
//         .append("circle")
//         .attr("class", "stateCircle")
//         .attr("cx", d => xLinearScale(d[chosenXAxis]))
//         .attr("cy", d => yLinearScale(d[chosenYAxis]))
//         .attr("r", 10);

//     // add data labels
//     var stateLabel = chartGroup.append("g")
//         .selectAll("text")
//         .data(data)
//         .enter()
//         .append("text")
//         .attr("class", "stateText")
//         .attr("x", d => xLinearScale(d[chosenXAxis]))
//         .attr("y", d => yLinearScale(d[chosenYAxis]))
//         .attr("dy", ".35em")
//         .text(d => d.abbr);

//     // Create group for x-axis labels
//     var xlabelsGroup = chartGroup.append("g")
//         .attr("transform", `translate(${width / 2}, ${height + 20})`);

//     var povertyLabel = xlabelsGroup.append("text")
//         .attr("x", 0)
//         .attr("y", 20)
//         .attr("value", "poverty") // value to grab for event listener
//         .classed("active", true)
//         .text("In Poverty (%)");

//     var ageLabel = xlabelsGroup.append("text")
//         .attr("x", 0)
//         .attr("y", 40)
//         .attr("value", "age") // value to grab for event listener
//         .classed("inactive", true)
//         .text("Age (Median)");

//     var incomeLabel = xlabelsGroup.append("text")
//         .attr("x", 0)
//         .attr("y", 60)
//         .attr("value", "income") // value to grab for event listener
//         .classed("inactive", true)
//         .text("Household Income (Median)");

//     // Create group for y-axis labels
//     var ylabelsGroup = chartGroup.append("g")
//         .attr("transform", "rotate(-90)");

//     var healthcareLabel = ylabelsGroup.append("text")
//         .attr("y", 0 - margin.left + 60)
//         .attr("x", 0 - (height / 2))
//         .attr("value", "healthcare")
//         .classed("active", true)
//         .text("Lacks Healthcare (%)");

//     var smokesLabel = ylabelsGroup.append("text")
//         .attr("y", 0 - margin.left + 40)
//         .attr("x", 0 - (height / 2))
//         .attr("value", "smokes")
//         .classed("inactive", true)
//         .text("Smokes (%)");

//     var obesityLabel = ylabelsGroup.append("text")
//         .attr("y", 0 - margin.left + 20)
//         .attr("x", 0 - (height / 2))
//         .attr("value", "obesity")
//         .classed("inactive", true)
//         .text("Obese (%)");

//     // updateToolTip function above csv import
//     var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

//     // x axis labels event listener
//     xlabelsGroup.selectAll("text").on("click", function() {
//         // get value of selection
//         var value = d3.select(this).attr("value");

//         // update x axis and scale with transition
//         if (value !== chosenXAxis) {
//             chosenXAxis = value;          // replaces chosenXAxis with value
//             xLinearScale = axisScale(data, chosenXAxis);
//             xAxis = renderXAxes(xLinearScale, xAxis);

//             // updates circles with new x values
//             circlesGroup = renderCircles(circlesGroup, "cx", xLinearScale, chosenXAxis);

//             // updates tooltips with new info
//             circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

//             // update state labels
//             stateLabel =  updateStateTexts(stateLabel, "x", xLinearScale, chosenXAxis);

//             // changes classes to change bold text
//             switch (chosenXAxis) {
//                 case "poverty":
//                     povertyLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     ageLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     incomeLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     break;
//                 case "age":
//                     povertyLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     ageLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     incomeLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     break;
//                 case "income":
//                     povertyLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     ageLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     incomeLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                 }
//         }
//     });

//     // y axis labels event listener
//     ylabelsGroup.selectAll("text").on("click", function() {
//         // get value of selection
//         var value = d3.select(this).attr("value");

//         // update y axis and scale with transition
//         if (value !== chosenYAxis) {
//             chosenYAxis = value;          // replaces chosenXAxis with value
//             yLinearScale = axisScale(data, chosenYAxis);
//             yAxis = renderYAxes(yLinearScale, yAxis);

//             // updates circles with new x values
//             circlesGroup = renderCircles(circlesGroup, "cy", yLinearScale, chosenYAxis);

//             // updates tooltips with new info
//             circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

//             // update state labels
//             stateLabel =  updateStateTexts(stateLabel, "y", yLinearScale, chosenYAxis);

//             // changes classes to change bold text
//             switch (chosenYAxis) {
//                 case "healthcare":
//                     healthcareLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     smokesLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     obesityLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     break;
//                 case "smokes":
//                     healthcareLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokesLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     obesityLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     break;
//                 case "obesity":
//                     healthcareLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokesLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     obesityLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                 }
//         }
//     });

// }).catch(function(error) {
//     console.log(error);
// });
