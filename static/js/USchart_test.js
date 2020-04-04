// Data source
const urlLineChartUS = "http://127.0.0.1:5000/dataByStates";

d3.json(urlLineChartUS).then( function (data) {

    data.forEach((d) => {
        d.date = +d.date;
        d.cases = +d.cases;
        d.death = +d.death;
    });

    // slice the date for the top 8 states
    const data_US_NY = data.filter((d) => {
        return d["province_state"] === "New York";
    });

    const data_US_NJ = data.filter((d) => {
        return d["province_state"] === "New Jersey";
    });

    const data_US_CA = data.filter((d) => {
        return d["province_state"] === "California";
    });

    var data_US_MI = data.filter((d) => {
        return d["province_state"] === "Michigan";
    });

    var data_US_MA = data.filter((d) => {
        return d["province_state"] === "Massachusetts";
    });

    var data_US_FL = data.filter((d) => {
        return d["province_state"] === "Florida";
    });

    var data_US_WA = data.filter((d) => {
        return d["province_state"] === "Washington";
    });

    var data_US_IL = data.filter((d) => {
        return d["province_state"] === "Illinois";
    });

    var time_list = data_US_NY.map(d => d.date);
    var dateFormatter = d3.timeFormat("%d-%b");
    var time_list_new = time_list.map(d => dateFormatter(d)).slice(-15);
    var time_15 = time_list.slice(-15);

    // Slice dataset for NY
    var case_number_NY = [];
    var cNY = [];
    for (i = 0; i < time_15.length; i++) {
        data_each_day = data_US_NY.filter((d) => {
            return d["date"] === time_15[i];
        });
        cNY = cNY.concat(data_each_day);

    }
    case_number_NY = cNY.map(d => d.cases);

    // Slice dataset for NJ
    var time_list_NJ = data_US_NJ.map(d => d.date);
    var time_15_NJ = time_list_NJ.slice(-15);
    var case_number_NJ = [];
    var cNJ = [];
    for (i = 0; i < time_15_NJ.length; i++) {
        data_each_day = data_US_NJ.filter((d) => {
            return d["date"] === time_15_NJ[i];
        });
        cNJ = cNJ.concat(data_each_day);
    }
    case_number_NJ = cNJ.map(d => d.cases);

    // Slice dataset for CA
    var time_list_CA = data_US_CA.map(d => d.date);
    var time_15_CA = time_list_CA.slice(-15);
    var case_number_CA = [];
    var cCA = [];
    for (i = 0; i < time_15_CA.length; i++) {
        data_each_day = data_US_CA.filter((d) => {
            return d["date"] === time_15_CA[i];
        });
        cCA = cCA.concat(data_each_day);
    }
    case_number_CA = cCA.map(d => d.cases);

    // Slice dataset for MI
    var time_list_MI = data_US_MI.map(d => d.date);
    var time_15_MI = time_list_MI.slice(-15);
    var case_number_MI = [];
    var cMI = [];
    for (i = 0; i < time_15_MI.length; i++) {
        data_each_day = data_US_MI.filter((d) => {
            return d["date"] === time_15_MI[i];
        });
        cMI = cMI.concat(data_each_day);
    }
    case_number_MI = cMI.map(d => d.cases);

    // Slice dataset for MA
    var time_list_MA = data_US_MA.map(d => d.date);
    var time_15_MA = time_list_MA.slice(-15);
    var case_number_MA = [];
    var cMA = [];
    for (i = 0; i < time_15_MA.length; i++) {
        data_each_day = data_US_MA.filter((d) => {
            return d["date"] === time_15_MA[i];
        });
        cMA = cMA.concat(data_each_day);
    }
    case_number_MA = cMA.map(d => d.cases);

    // Slice dataset for FL
    var time_list_FL = data_US_FL.map(d => d.date);
    var time_15_FL = time_list_FL.slice(-15);
    var case_number_FL = [];
    var cFL = [];
    for (i = 0; i < time_15_FL.length; i++) {
        data_each_day = data_US_FL.filter((d) => {
            return d["date"] === time_15_FL[i];
        });
        cFL = cFL.concat(data_each_day);
    }
    case_number_FL = cFL.map(d => d.cases);

    // Slice dataset for WA
    var time_list_WA = data_US_WA.map(d => d.date);
    var time_15_WA = time_list_WA.slice(-15);
    var case_number_WA = [];
    var cWA = [];
    for (i = 0; i < time_15_WA.length; i++) {
        data_each_day = data_US_WA.filter((d) => {
            return d["date"] === time_15_WA[i];
        });
        cWA = cWA.concat(data_each_day);
    }
    case_number_WA = cWA.map(d => d.cases);

    // Slice dataset for IL
    var time_list_IL = data_US_IL.map(d => d.date);
    var time_15_IL = time_list_IL.slice(-15);
    var case_number_IL = [];
    var cIL = [];
    for (i = 0; i < time_15_IL.length; i++) {
        data_each_day = data_US_IL.filter((d) => {
            return d["date"] === time_15_IL[i];
        });
        cIL = cIL.concat(data_each_day);
    }
    case_number_IL = cIL.map(d => d.cases);


    Highcharts.chart('timeSeriesPlotUS', {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Top 8 States with the most confirmed cases in US'
        },
        subtitle: {
            text: 'data start from Mar 10th 2020'
        },
        xAxis: {
            categories: time_list_new,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: 'Confirmed Cases'
            },
            labels: {
                formatter: function () {
                    return this.value ;
                }
            }
        },
        tooltip: {
            split: true,
            valueSuffix: ' cases'
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },


        series: [{
            name: 'New York',
            data: case_number_NY
        }, {
            name: 'New Jersey',
            data: case_number_NJ
        }, {
            name: 'California',
            data: case_number_CA
        }, {
            name: 'Michigan',
            data: case_number_MI
        }, {
            name: 'Massachusett',
            data: case_number_MA
        }, {
            name: 'Florida',
            data: case_number_FL
        }, {
            name: 'Washington',
            data: case_number_WA
        }, {
            name: 'Illinois',
            data: case_number_IL
        },]
    });

});