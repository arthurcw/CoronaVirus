const url3 = "./Datasets/Covid19_20200327.csv";
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

var parseTime = d3.timeParse("%m/%d/%Y");
// Import Data
d3.csv(url3, function (data) {
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach((d) => {
        d.date = parseTime(d.date);
        d.cases = +d.cases;
        d.death = +d.death;
    });
    data = data.filter((d) => {
        return d["country_region"] === "China" & d["admin2"] == "" & d["province_state"] == ""
    });
    console.log(data);

    var maxDate = d3.max(data, function (d) { return d.date; });
    var minDate = d3.min(data, function (d) { return d.date; });
    var maxNumber = d3.max(data, function (d) { return d.cases; });
    console.log(maxDate);
    console.log(minDate);
    console.log(maxNumber);


    // Append SVG element
    var svg = d3.select("#timeSeriesPlot")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    var y = d3.scaleLinear()
        .domain([0, maxNumber])
        .range([height, 0]);
    var x = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, width]);

    var xAxis = d3.axisBottom(x)
        .tickSize(-height)
        .tickPadding(14);

    var yAxis = d3.axisLeft(y)
        .tickSize(-width)
        .tickPadding(10);
    // var yAxis = d3.axisLeft(y);
    var yAxisLabel = 'number';
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
    var xAxisLabel = 'time';
    var xAxisG = chartGroup.append('g').call(xAxis)
        .attr('transform', `translate(0,${height})`);

    xAxisG.select('.domain').remove();

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 50)
        .attr('x', width / 2)
        .attr('fill', 'black')
        .text(xAxisLabel);
    var lineGenerator = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.cases); });
    chartGroup.append('path')
        .data([data])
        .attr("d", lineGenerator(data))
        .attr("fill", "none")
        .attr("stroke", "red");

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.cases))
        .attr("r", "3")
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
});










    // // Source of data
    // const url = "http://127.0.0.1:5000/dataCovid19";
    // // const url = "./merge_counties_and_ coordinates.csv";
    // const selectDate = Date.parse("2020-03-25");
    // const caseFieldName = "cases";     // field name of confirmed cases
    // const deathFieldName = "deaths";    // field name of deaths

    // // Map initialization parameters
    // const centerCoords = [20, 0];
    // const mapBounds = [[90, -180], [-90, 180]];
    // const mapZoomLevel = 2;

    // // Function to parse data
    // function parseData(data) {
    //     data.forEach(d => {
    //         d.date = +d.date;
    //         d.cases = +d.cases;
    //         d.death = +d.death;
    //         d.latitude = +d.latitude;
    //         d.longitude = +d.longitude;

    //         if (d.province_state === null) {
    //             d.desc = d.country_region;
    //         } else if (d.admin2 === null) {
    //             d.desc = d.province_state;
    //         } else {
    //             d.desc = d.admin2 + ", " + d.province_state;
    //         };
    //     });
    //     return data;
    // }

    // // assign marker-cluster icon class
    // function iconClass(count) {
    //     var c = ' marker-cluster-';
    //     if (count < 10) {
    //         c += 'small';
    //     } else if (count < 100) {
    //         c += 'medium';
    //     } else {
    //         c += 'large';
    //     };
    //     return c;
    // };

    // /**
    //  * Create marker layer group
    //  * @param {*} data : COVID-19 data
    //  * @param {string} category: data category (# of confirmed cases or deaths)
    //  */
    // function createMarkers(data, category) {
    //     // Remove zero data points
    //     data = data.filter((d) => {
    //         return d[category] > 0
    //             & !(d["latitude"] === 0 & d["longitude"] === 0)
    //             & !(d["country_region"] === "US" & d["admin2"] === null)
    //             & !((d["country_region"] === "Australia"
    //                 | d["country_region"] === "Canada"
    //                 | d["country_region"] === "China") & d["province_state"] === null);
    //     });

    //     // Create Marker Cluster
    //     var markerCluster = L.markerClusterGroup({
    //         maxClusterRadius: 160,
    //         iconCreateFunction: function (cluster) {
    //             var markers = cluster.getAllChildMarkers();
    //             var n = 0;
    //             for (var i = 0; i < markers.length; i++) {
    //                 n += markers[i].number;
    //             }

    //             var c = iconClass(n);
    //             return L.divIcon({ html: '<div><span>' + n + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
    //         }
    //     });

    //     // Loop through data array
    //     data.forEach(feature => {
    //         // build pop up
    //         var popup = "<b>" + feature.desc +
    //             '<br>' + feature[category] + "</b>";

    //         // marker icon, borrow style from marker cluster
    //         var markerIcon = L.divIcon({
    //             html: '<div><span>' + feature[category] + '</span></div>',
    //             className: 'marker-cluster ' + iconClass(feature[category])
    //         });

    //         // marker for each feature
    //         var dataMarker = L
    //             .marker([feature.latitude, feature.longitude], {
    //                 icon: markerIcon
    //             })
    //             .bindPopup(popup);
    //         // # of cases to feed into marker cluster marker.number
    //         dataMarker.number = feature[category];

    //         // Add marker to marker cluster
    //         markerCluster.addLayer(dataMarker);
    //     });

    //     // Return layer group
    //     return markerCluster;
    //     // return L.layerGroup(markerCluster);
    // };

    // /**
    //  * Function to generate legend
    //  * @param {string} dateString - data date
    //  */
    // function createLegend(dateString) {
    //     // add layer control
    //     var legend = L.control({
    //         position: "bottomright"
    //     });

    //     // insert a div with the class of "legend"
    //     legend.onAdd = function () {
    //         // add div
    //         var div = L.DomUtil.create("div", "legend");

    //         // add date string to div
    //         div.innerHTML = [
    //             "<h2>" + dateString + "</h2>",
    //         ].join("");
    //         return div;
    //     };

    //     return legend;
    // };

    // /**
    //  * Create Map
    //  * @param {*} data : COVID-19 cases data
    //  */
    // function createMap(data) {
    //     // Data Check
    //     // console.log(data);

    //     // Parse data
    //     data = parseData(data);

    //     // Date Filter
    //     data = data.filter((d) => {
    //         return d["date"] == selectDate;
    //     });
    //     // console.log(data);

    //     // Create the tile layer that will be the background of our map
    //     var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    //         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    //         maxZoom: 18,
    //         id: "mapbox.light",
    //         accessToken: API_KEY
    //     });

    //     // Create a baseMaps object to hold the lightmap layer
    //     var baseMaps = {
    //         "Light Map": lightMap
    //     };

    //     // Create marker cluster layer
    //     var confirmedCases = createMarkers(data, caseFieldName);
    //     // var deathCases = createMarkers(data, deathFieldName);

    //     // Create an overlayMaps object to hold the marker layer
    //     // var overlayMaps = {
    //     //     "Confirmed Cases": confirmedCases,
    //     //     "Deaths": deathCases
    //     // };

    //     // Create the map object with options
    //     var myMap = L.map("map", {
    //         maxBounds: mapBounds,
    //         center: centerCoords,
    //         zoom: mapZoomLevel,
    //         layers: [lightMap, confirmedCases]
    //     });

    //     // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    //     // L.control.layers(baseMaps, overlayMaps, {
    //     //     collapsed: false
    //     // }).addTo(myMap);
    //     myMap.addLayer(lightMap);
    //     myMap.addLayer(confirmedCases);

    //     // Create legend, add to map
    //     var dt = new Date(0);
    //     dt.setUTCMilliseconds(selectDate);
    //     var legend = createLegend(
    //         dt.toUTCString().split(' ').slice(0, 4).join(' ')
    //     );
    //     legend.addTo(myMap);

    // };

    // // Run
    // // d3.csv(url, createMap);
    // d3.json(url3, createMap);