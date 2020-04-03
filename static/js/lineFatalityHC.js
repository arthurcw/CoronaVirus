// Using Highcharts to plot fatality rate over time

// Source of data
const urlByCountry = "http://127.0.0.1:5000/dataByCountry";
const figFatalityID = "deathRatePlot"

// Countries to plot
const countryFatalityList =[
    "US", "China", "Italy", "Iran", "Korea, South",
    "Brazil", "United Kingdom", "Japan", "Taiwan"
    ];

// Function to gerenate time serie plot
function generateFatalityTS(data) {
    // Build data series
    function buildSeries() {
        var seriesAll = [];
        countryFatalityList.forEach( country => {
            var dataSeries = {};

            // series name
            dataSeries["name"] = country

            // series data
            var dataCountry = data.filter(d => d.country_region === country);
            dataCountry.sort(function (a, b) { return a.date - b.date });
            var dataPoints = [];
            dataCountry.forEach(d=> {
                // x, y coordinates (date, death rate)
                dataPoints.push([+d.date, +d.death/+d.cases * 100])
            });
            dataSeries["data"] = dataPoints;
            seriesAll.push(dataSeries);
        });
        return seriesAll;
    };
    series = buildSeries();

    // Highcharts template
    Highcharts.chart(figFatalityID, {
        chart: { zoomType: 'x' },
        title: { text: 'Fatality Rate'},
        subtitle: { text: 'Death divided by Confirmed Cases' },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter:function() {
                    return Highcharts.dateFormat('%m-%d',this.value);
                },
                style: { fontSize: '15px' }
            }
        },
        yAxis: {
            title: {
                text: 'Fatality Rate (%)',
                style: { fontSize: '15px' }
            },
            min:0,
            labels: { style: { fontSize: '15px' } }
        },
        legend: { enabled: true },
        plotOptions: {
            series: { marker: { enabled: true } }
        },
        tooltip: { valueDecimals: 2 },
        series: series
    });
};

d3.json(urlByCountry).then( data => {
    generateFatalityTS(data);
    // console.log(data);
})

//.catch(function(error) { console.log(error); });