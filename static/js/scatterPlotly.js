// API link
const urlScatterPlots = "http://127.0.0.1:5000/dataLatestInfo";

/**
 * Function to unpack data into arrays
 * @param {*} data
 * @param {string} category - column name of dataset to compare to compare (population, med_age, gdp or health_exp)
 */
function unpackData(data, category) {
    // unpack data into arrays
    var casesCountry = [];
    var casesCount = [];
    var casesCategory = [];
    var deathCountry = [];
    var deathCount = [];
    var deathCategory = [];
    data.forEach(d=> {
        if (d[category] != null & d[category] > 0 & d.cases > 0) {
            casesCountry.push(d.country_region);
            casesCount.push(+d.cases);
            casesCategory.push(+d[category]);
        }
        if (d[category] != null & d[category] > 0 & d.death > 0) {
            deathCountry.push(d.country_region);
            deathCount.push(+d.death);
            deathCategory.push(+d[category]);
        }
    });
    return { casesCountry, casesCount, casesCategory,
            deathCountry, deathCount, deathCategory}
};

/**
 * Function to use Plotly to generate scatter plots
 * @param {*} data
 * @param {string} category - column name of dataset to compare to compare (population, med_age, gdp or health_exp)
 * @param {string} xScale - plotting scale (lienar or log)
 * @param {string} yScale - plotting scale (lienar or log)
 * @param {string} tagID - ID of html element to plot
 * @param {string} txtXAxis - x-axis label
 * @param {string} txtYAxis - y-axis label
 */
function generatePlot(data, category, xScale, yScale, tagID, txtXAxis, txtYAxis) {
    // Unpack data
    var dataUnpack = unpackData(data, category);

    // Set up for Plotly
    const markerSize = 12;
    const markerBorderWidth = 1;
    let trace = [{
        name: "Confirmed Cases",
        x: dataUnpack.casesCategory,
        y: dataUnpack.casesCount,
        mode: "markers",
        marker: {
            size: markerSize,
            color: 'rgba(223, 83, 83, 0.8)',
            line: { color: 'white',
                    width: markerBorderWidth
                }
        },
        text: dataUnpack.casesCountry
    },
    {
        name: "# of Deaths",
        x: dataUnpack.deathCategory,
        y: dataUnpack.deathCount,
        mode: "markers",
        marker: {
            size: markerSize,
            color: 'rgba(119, 152, 191, 0.8)',
            line: { color: 'white',
                    width: markerBorderWidth
                }
        },
        text: dataUnpack.deathCountry
    }]

    let updatemenus=[
        {
            buttons: [
                {
                    args: [{'visible': [true, true]},
                           {'xaxis': {title: txtXAxis, 'type': 'linear'},
                           'yaxis': {title: txtYAxis, 'type': 'linear'}}],
                    label: 'Linear-Linear',
                    method: 'update'
                },
                {
                    args: [{'visible': [true, true]},
                           {'xaxis': {title: txtXAxis,'type': 'linear'},
                           'yaxis': {title: txtYAxis, 'type': 'log'}}],
                    label: 'Lin-Log',
                    method: 'update'
                },
                {
                    args: [{'visible': [true, true]},
                           {'xaxis': {title: txtXAxis,'type': 'log'},
                           'yaxis': {title: txtYAxis, 'type': 'linear'}}],
                    label: 'Log-Lin',
                    method: 'update'
                },
                {
                    args: [{'visible': [true, true]},
                           {'xaxis': {title: txtXAxis,'type': 'log'},
                           'yaxis': {title: txtYAxis, 'type': 'log'}}],
                    label: 'Log-Log',
                    method: 'update'
                }
            ],
            direction: 'left',
            pad: {'r': 10, 't': 10},
            showactive: true,
            type: 'buttons',
            x: 0.1,
            xanchor: 'left',
            y: 1.1,
            yanchor: 'top'
        },
    ];

    let layout = {
        title: "Number of Cases vs. " + txtXAxis,
        font: { size: 14 },
        xaxis: {
            title: txtXAxis,
            type: xScale
        },
        yaxis: {
            title: txtYAxis,
            type: yScale
        },
        margin: {t:60},
        updatemenus: updatemenus
    };

    let config = { responsive: true };

    Plotly.newPlot(tagID, trace, layout, config);
};

function generateScatterPlots(data) {
    // data, data column, x-axis scale, y-axis scale, ID of <figure> element, chart X-axis label, chart Y-axis label
    // 1. Population
    generatePlot(data, "population", "log", "log", "popContainer", "Population", "Number of Cases");
    // 2. Median Age
    generatePlot(data, "med_age", "linear", "log", "ageContainer", "Median Age", "Number of Cases");
    // 3. GDP
    generatePlot(data, "gdp", "log", "log", "gdpContainer", "per capita GDP ($)", "Number of Cases");
    // 4. Healthcare Expense
    generatePlot(data, "health_exp", "linear", "log", "hcContainer", "Expense as % of GDP", "Number of Cases");

};

// Read data and run
d3.json(urlScatterPlots, generateScatterPlots);