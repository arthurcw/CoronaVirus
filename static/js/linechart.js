const url3 = "./Datasets/Covid19_20200327.csv";
const deathnumber = "./Datasets/Covid19_20200327.csv";
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
var svg = d3.select("#timeSeriesPlot")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Import Data
d3.csv(url3, function (data) {
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

        // console.log(data_country);

        maxNumberEach = d3.max(data_country, function (d) { return d.cases; });
        caseNumber = caseNumber.concat(maxNumberEach);
        maxNumber = d3.max(caseNumber);

        // console.log(maxNumber);
        var xTimeScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width])
        .nice();

        var yLinearScale_each = d3.scaleLinear()
        .domain([0, 90000])
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
            .attr('y', -60)
            .attr('x', -height / 2)
            .attr('fill', 'black')
            .attr('transform', `rotate(-90)`)
            .attr('text-anchor', 'middle')
            .text(yAxisLabel);
        // var xAxis = d3.axisBottom(x); 

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
        
        // var color_each = color_list[i];
        // console.log(color_each);

        chartGroup.append('path')
            .data([data_country])
            .attr("d", lineGenerator_each(data_country))
            .attr("fill", "none")
            .attr("stroke", color_list[i]);
        
        var circlesGroup = chartGroup.selectAll("circle")
            .data(data_country)
            .enter()
            .append("circle")
            .attr("cx", d => xTimeScale(d.date))
            .attr("cy", d => yLinearScale_each(d.cases))
            .attr("r", "2")
            .attr("fill", "gold")
            .attr("stroke-width", "1")
            .attr("stroke", "black");

        // Date formatter to display dates nicely
        var dateFormatter = d3.timeFormat("%d-%b");

        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([70, -60])
            .html(function (d) {
                return (`<strong>${dateFormatter(d.date)}<strong><hr>${d.cases}
                    case(s) confirmed`);
            });

        // Step 2: Create the tooltip in chartGroup.
        chartGroup.call(toolTip);

        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function (d) {
            toolTip.show(d, this);
        })
            // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function (d) {
                toolTip.hide(d);
            });
    

    }
    

    // var maxNumber1 = d3.max(data1, function (d) { return d.cases; });
    // var maxNumber2 = d3.max(data2, function (d) { return d.cases; });
    // var maxNumber3 = d3.max([maxNumber1, maxNumber2]) + 5000;

    // // Create scaling functions
    // var xTimeScale = d3.scaleTime()
    //     .domain(d3.extent(data, d => d.date))
    //     .range([0, width]);

    // var yLinearScale1 = d3.scaleLinear()
    //     .domain([0, maxNumber3])
    //     .range([height, 0]);

    // var yLinearScale2 = d3.scaleLinear()
    //     .domain([0, maxNumber3])
    //     .range([height, 0]);

    // var bottomAxis= d3.axisBottom(xTimeScale)
    //     .tickSize(-height)
    //     .tickPadding(14);

    // var yAxis = d3.axisLeft(yLinearScale1)
    //     .tickSize(-width)
    //     .tickPadding(10);

    // var yAxisLabel = 'Confirmed Cases Number';
    // var yAxisG = chartGroup.append('g').call(yAxis);
    // yAxisG.selectAll('.domain').remove();

    // yAxisG.append('text')
    //     .attr('class', 'axis-label')
    //     .attr('y', -60)
    //     .attr('x', -height / 2)
    //     .attr('fill', 'black')
    //     .attr('transform', `rotate(-90)`)
    //     .attr('text-anchor', 'middle')
    //     .text(yAxisLabel);
    // // var xAxis = d3.axisBottom(x); 

    // var xAxisLabel = 'Date';
    // var xAxisG = chartGroup.append('g')
    //     .classed("x-axis", true)
    //     .attr('transform', `translate(0,${height})`)
    //     .call(bottomAxis);

    // xAxisG.select('.domain').remove();

    // xAxisG.append('text')
    //     .attr('class', 'axis-label')
    //     .attr('y', 50)
    //     .attr('x', width / 2)
    //     .attr('fill', 'black')
    //     .text(xAxisLabel);

    // var lineGenerator1 = d3.line()
    //     .x(function (d) { return xTimeScale(d.date); })
    //     .y(function (d) { return yLinearScale1(d.cases); });

    // var lineGenerator2 = d3.line()
    //     .x(function (d) { return xTimeScale(d.date); })
    //     .y(function (d) { return yLinearScale2(d.cases); });   

    // chartGroup.append('path')
    //     .data([data1])
    //     .attr("d", lineGenerator1(data1))
    //     .attr("fill", "none")
    //     .attr("stroke", "red");

    // chartGroup.append('path')
    //     .data([data2])
    //     .attr("d", lineGenerator2(data2))
    //     .attr("fill", "none")
    //     .attr("stroke", "blue");

    // var circlesGroup = chartGroup.selectAll("circle")
    //     .data(data1)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", d => xTimeScale(d.date))
    //     .attr("cy", d => yLinearScale1(d.cases))
    //     .attr("r", "3")
    //     .attr("fill", "gold")
    //     .attr("stroke-width", "1")
    //     .attr("stroke", "black");

    // // Date formatter to display dates nicely
    // var dateFormatter = d3.timeFormat("%d-%b");

    // // Step 1: Initialize Tooltip
    // var toolTip = d3.tip()
    //     .attr("class", "tooltip")
    //     .offset([70, -60])
    //     .html(function (d) {
    //         return (`<strong>${dateFormatter(d.date)}<strong><hr>${d.cases}
    //             case(s) confirmed`);
    //     });

    // // Step 2: Create the tooltip in chartGroup.
    // chartGroup.call(toolTip);

    // // Step 3: Create "mouseover" event listener to display tooltip
    // circlesGroup.on("mouseover", function (d) {
    //     toolTip.show(d, this);
    // })
    //     // Step 4: Create "mouseout" event listener to hide tooltip
    //     .on("mouseout", function (d) {
    //         toolTip.hide(d);
    //     });
});



// // Initial Params
// var chosenXAxis = "confirmed_cases";

// // function used for updating x-scale var upon click on axis label
// function xScale(data, chosenXAxis) {
//     // create scales
//     var xLinearScale = d3.scaleLinear()
//       .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
//         d3.max(data, d => d[chosenXAxis]) * 1.2
//       ])
//       .range([0, width]);
  
//     return xLinearScale;
  
//   }

// // function used for updating xAxis var upon click on axis label
// function renderAxes(newXScale, xAxis) {
//     var bottomAxis = d3.axisBottom(newXScale);
  
//     xAxis.transition()
//       .duration(1000)
//       .call(bottomAxis);
  
//     return xAxis;
//   }

// // function used for updating circles group with a transition to
// // new circles
// function renderCircles(circlesGroup, newXScale, chosenXAxis) {

//     circlesGroup.transition()
//       .duration(1000)
//       .attr("cx", d => newXScale(d[chosenXAxis]));
  
//     return circlesGroup;
//   }

// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//     var label;
  
//     if (chosenXAxis === "confirmed_cases") {
//       label = "Confirmed Cases";
//     }
//     else {
//       label = "Death Cases:";
//     }
  
//     var toolTip = d3.tip()
//       .attr("class", "tooltip")
//       .offset([80, -60])
//       .html(function(d) {
//         return (`${d.cases}<br>${label} ${d[chosenXAxis]}`);
//       });
  
//     circlesGroup.call(toolTip);
  
//     circlesGroup.on("mouseover", function(data) {
//       toolTip.show(data);
//     })
//       // onmouseout event
//       .on("mouseout", function(data, index) {
//         toolTip.hide(data);
//       });
  
//     return circlesGroup;
//   }

// __________________________________________________________________

  

    // Import Data
d3.csv(url3, function (data) {
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    // Create a function to parse date and time
    var parseTime = d3.timeParse("%m/%d/%Y");

    data.forEach((d) => {
        d.date = parseTime(d.date);
        d.cases = +d.cases;
        d.death = +d.death;
    });


    china = data.filter((d) => {
        return d["country_region"] === "China" & d["admin2"] == "" & d["province_state"] == ""
    });
    console.log(data1);

    us = data.filter((d) => {
        return d["country_region"] === "US" & d["admin2"] == "" & d["province_state"] == ""
    });

    itali=  data.filter((d) => {
        return d["country_region"] === "Itali" & d["admin2"] == "" & d["province_state"] == ""
    });
    m=data1.concat(data2)

    // var maxDate = d3.max(data, function (d) { return d.date; });
    // var minDate = d3.min(data, function (d) { return d.date; });
    var maxNumber1 = d3.max(data1, function (d) { return d.cases; });
    var maxNumber2 = d3.max(data2, function (d) { return d.cases; });
    // console.log(maxDate);
    // console.log(minDate);
    // console.log(maxNumber1);
    // console.log(maxNumber2);

    // Create scaling functions
    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

    var yLinearScale1 = d3.scaleLinear()
        .domain([0, maxNumber1])
        .range([height, 0]);

    var yLinearScale2 = d3.scaleLinear()
        .domain([0, maxNumber2])
        .range([height, 0]);

    var bottomAxis= d3.axisBottom(xTimeScale)
        .tickSize(-height)
        .tickPadding(14);

    var yAxis = d3.axisLeft(yLinearScale1)
        .tickSize(-width)
        .tickPadding(10);

    // // Create group for  2 x- axis labels
    // var labelsGroup = chartGroup.append("g")
    // .attr("transform", `translate(${width / 2}, ${height + 20})`);
  

    var yAxisLabel = 'Confirmed Cases Number';
    var yAxisG = chartGroup.append('g').call(yAxis);
    yAxisG.selectAll('.domain').remove();

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -60)
        .attr('x', -height / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);
    // var xAxis = d3.axisBottom(x); 

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



    var lineGenerator1 = d3.line()
        .x(function (d) { return xTimeScale(d.date); })
        .y(function (d) { return yLinearScale1(d.cases); });

    var lineGenerator2 = d3.line()
        .x(function (d) { return xTimeScale(d.date); })
        .y(function (d) { return yLinearScale2(d.cases); });   

    chartGroup.append('path')
        .data([data1])
        .attr("d", lineGenerator1(data1))
        .attr("fill", "none")
        .attr("stroke", "red");

    chartGroup.append('path')
        .data([data2])
        .attr("d", lineGenerator2(data2))
        .attr("fill", "none")
        .attr("stroke", "blue");

   

    var circlesGroup = chartGroup.selectAll("circle")
        .data(m) 
        .enter()
        .append("circle")
        .attr("cx", d => xTimeScale(d.date))
        .attr("cy", d => yLinearScale1(d.cases))
        .attr("r", "3")
        .attr("fill", "gold")
        .attr("stroke-width", "1")
        .attr("stroke", "black");


// // updateToolTip function above csv import
// var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

// // x axis labels event listener
// labelsGroup.selectAll("text")
//   .on("click", function() {
//     // get value of selection
//     var value = d3.select(this).attr("value");
//     if (value !== chosenXAxis) {

//       // replaces chosenXAxis with value
//       chosenXAxis = value;

//       // console.log(chosenXAxis)

//       // functions here found above csv import
//       // updates x scale for new data
//       xLinearScale = xScale(data, chosenXAxis);

//       // updates x axis with transition
//       xAxis = renderAxes(xLinearScale, xAxis);

//       // updates circles with new x values
//       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

//       // updates tooltips with new info
//       circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//       // changes classes to change bold text
//       if (chosenXAxis === "confirmed_cases") {
//         albumsLabel
//           .classed("active", true)
//           .classed("inactive", false);
//         hairLengthLabel
//           .classed("active", false)
//           .classed("inactive", true);
//       }
//       else {
//         albumsLabel
//           .classed("active", false)
//           .classed("inactive", true);
//         hairLengthLabel
//           .classed("active", true)
//           .classed("inactive", false);
//       }
//     }
//   });
// }).catch(function(error) {
// console.log(error);

// });

// });




    // Date formatter to display dates nicely
    var dateFormatter = d3.timeFormat("%d-%b");

    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([70, -60])
        .html(function (d) {
            return (`<strong>${dateFormatter(d.date)}<strong><hr>${d.cases}
                case(s) confirmed`);
        });

    // Step 2: Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function (d) {
        toolTip.show(d, this);
    })
        // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function (d) {
            toolTip.hide(d);
        });


});
