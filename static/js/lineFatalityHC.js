// Using Highcharts to plot fatality rate over time

// Source of data
const urlByCountry = "http://127.0.0.1:5000/dataByCountry";

d3.json(urlByCountry).then( data => {
    // generateFatalityTimeSeries(data);
    console.log(data);
}).catch(function(error) { console.log(error); });