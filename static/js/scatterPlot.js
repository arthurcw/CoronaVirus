// Plotting scatter plots using HighCharts
// Not Used

// Source of data
// const urlScatterPlots = "http://127.0.0.1:5000/dataLatestInfo";

// function plotScatterHighCharts(loc, data, category, xScale, txtTitle, txtxAxis, txtyAxis) {
//     // build data series
//     var confirmedList = [];
//     var deathList = [];
//     data.forEach(d=> {
//         if (d[category] != null & d[category] > 0 & d.cases > 0) {
//             confirmedList.push([d[category], d.cases, d.country_region])
//         }
//         if (d[category] != null & d[category] > 0 & d.death > 0) {
//             deathList.push([d[category], d.death, d.country_region])
//         }
//     })
//     var confirmedCases = {};
//     confirmedCases.name = 'Confirmed Cases';
//     confirmedCases.color = 'rgba(223, 83, 83, .5)';
//     confirmedCases.data = confirmedList;

//     var deathCases = {};
//     deathCases.name = 'Deaths'
//     deathCases.color = 'rgba(119, 152, 191, .5)';
//     deathCases.data = deathList;

//     // Highcharts template
//     Highcharts.chart(loc, {
//         chart: {
//             type: 'scatter',
//             zoomType: 'xy'
//         },
//         title: {
//             text: txtTitle
//         },
//         // subtitle: {
//         //     text: 'Source: John Hopkins and New York Times'
//         // },
//         xAxis: {
//             type: xScale,
//             title: {
//                 enabled: true,
//                 text: txtxAxis,
//                 style: { fontSize: '15px' }
//             },
//             labels: { style: { fontSize: '15px' } }
//         },
//         yAxis: {
//             type: 'logarithmic',
//             title: {
//                 text: txtyAxis,
//                 style: { fontSize: '15px' }
//             },
//             labels: { style: { fontSize: '15px' } }
//         },
//         legend: {
//             layout: 'vertical',
//             align: 'left',
//             verticalAlign: 'top',
//             x: 100,
//             y: 70,
//             floating: true,
//             backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
//             borderWidth: 1,
//             itemStyle: { fontSize: '15px' }
//         },
//         plotOptions: {
//             scatter: {
//                 marker: {
//                     radius: 5,
//                     states: {
//                         hover: {
//                             enabled: true,
//                             lineColor: 'rgb(100,100,100)'
//                         }
//                     }
//                 },
//                 states: {
//                     hover: {
//                         marker: {
//                             enabled: false
//                         }
//                     }
//                 },
//                 tooltip: {
//                     headerFormat: '<b>{series.name}</b><br>',
//                     pointFormat: '{point.x:,.0f}, {point.y:,.0f}'
//                 }
//             }
//         },
//         series: [confirmedCases, deathCases]
//     });

// }

// function generateScatter(data) {
//     console.log(data);
//     // <fig> tag in index.html, dataset, x-axis, x-axis scale, chart title, x-axis title, y-axis title
//     plotScatterHighCharts("popContainer", data, "population", "logarithmic", "Number of Cases vs Population", "Population", "Number of Cases");
//     plotScatterHighCharts("ageContainer", data, "med_age", "linear", "Number of Cases vs Median Age", "Median Age", "Number of Cases");
//     plotScatterHighCharts("gdpContainer", data, "gdp", "logarithmic", "Number of Cases vs per capita GDP", "per capita GDP ($)", "Number of Cases");
//     plotScatterHighCharts("hcContainer", data, "health_exp", "linear", "Number of Cases vs Healthcare Expense", "Expense as % of GDP", "Number of Cases");

// }

// // Read data and run
// d3.json(urlScatterPlots, generateScatter)
//     .catch(function(error) { console.log(error); });
