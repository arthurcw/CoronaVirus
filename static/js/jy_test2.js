// (function (d3) {
//     'use strict';

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
  
    var svg = d3.select("#timeSeriesPlotChina")
                    .append("svg")
                    .attr("width", svgWidth)
                    .attr("height", svgHeight);
    
    
    const render = data => {
        var title = 'test1';
            
        var xValue = d => d.date;
        var xAxisLabel = 'Time';
            
        var yValue = d => d.cases;
        // var circleRadius = 6;
        var yAxisLabel = 'number';

        var maxDate = d3.max(data, function(d) { return d.date; });
        var minDate = d3.min(data, function(d) { return d.date; });
        var maxNumber = d3.max(data, function(d) { return d.cases; });

        var xScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, width])
            .nice();
            
        var yScale = d3.scaleLinear()
            .domain([0, maxNumber])
            .range([height, 0])
            .nice();
            
        var g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
        var xAxis = d3.axisBottom(xScale)
            .tickSize(-height)
            .tickPadding(15);
            
        var yAxis = d3.axisLeft(yScale)
            .tickSize(-width)
            .tickPadding(10);
            
        var yAxisG = g.append('g').call(yAxis);
        yAxisG.selectAll('.domain').remove();
            
        yAxisG.append('text')
                .attr('class', 'axis-label')
                .attr('y', -60)
                .attr('x', -height / 2)
                .attr('fill', 'black')
                .attr('transform', `rotate(-90)`)
                .attr('text-anchor', 'middle')
                .text(yAxisLabel);
            
        var xAxisG = g.append('g').call(xAxis)
            .attr('transform', `translate(0,${height})`);
            
        xAxisG.select('.domain').remove();
            
        xAxisG.append('text')
                .attr('class', 'axis-label')
                .attr('y', 80)
                .attr('x', width / 2)
                .attr('fill', 'black')
                .text(xAxisLabel);
            
        var lineGenerator = d3.line()
            .x(d => xScale(xValue(d)))
            .y(d => yScale(yValue(d)))
;
            
        g.append('path')
                .attr('class', 'line-path')
                .attr('d', lineGenerator(data));
            
        g.append('text')
                .attr('class', 'title')
                .attr('y', -10)
                .text(title);
    };
  

    var parseTime = d3.timeParse("%m/%d/%Y");
    // d3.csv("./Datasets/Covid19_20200327.csv")
    //     .then(data => {
    //         data.forEach( (d) => {
    //             d.date = parseTime(d.date);
    //             d.cases = +d.cases;
    //             d.death = +d.death;
    //         });
    //         render(data);
    // });

    d3.csv("./Datasets/Covid19_20200327.csv", function(data) {
        data.forEach( (d) => {
            d.date = parseTime(d.date);
            d.cases = +d.cases;
            d.death = +d.death;
        });
        render(data);
    });


// }(d3));