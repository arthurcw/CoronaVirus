    // Source of data
    const url = "http://127.0.0.1:5000/dataCovid19";
    // const url = "./merge_counties_and_ coordinates.csv";
    const selectDate = Date.parse("2020-03-25");
    const caseFieldName = "cases";     // field name of confirmed cases
    const deathFieldName = "deaths";    // field name of deaths

    // Map initialization parameters
    const centerCoords = [20, 0];
    const mapBounds = [[90, -180], [-90, 180]];
    const mapZoomLevel = 2;

    // Function to parse data
    function parseData(data) {
        data.forEach(d => {
            d.date = +d.date;
            d.cases = +d.cases;
            d.death = +d.death;
            d.latitude = +d.latitude;
            d.longitude = +d.longitude;

            if (d.province_state === null) {
                d.desc = d.country_region;
            } else if (d.admin2 === null) {
                d.desc = d.province_state;
            } else {
                d.desc = d.admin2 + ", " + d.province_state;
            };
        });
        return data;
    }

    // assign marker-cluster icon class
    function iconClass(count) {
        var c = ' marker-cluster-';
        if (count < 10) {
            c += 'small';
        } else if (count < 100) {
            c += 'medium';
        } else {
            c += 'large';
        };
        return c;
    };

    /**
     * Create marker layer group
     * @param {*} data : COVID-19 data
     * @param {string} category: data category (# of confirmed cases or deaths)
     */
    function createMarkers(data, category) {
        // Remove zero data points
        data = data.filter((d) => {
            return d[category] > 0
                & !(d["latitude"] === 0 & d["longitude"] === 0)
                & !(d["country_region"] === "US" & d["admin2"] === null)
                & !((d["country_region"] === "Australia"
                    | d["country_region"] === "Canada"
                    | d["country_region"] === "China") & d["province_state"] === null);
        });

        // Create Marker Cluster
        var markerCluster = L.markerClusterGroup({
            maxClusterRadius: 160,
            iconCreateFunction: function (cluster) {
                var markers = cluster.getAllChildMarkers();
                var n = 0;
                for (var i = 0; i < markers.length; i++) {
                    n += markers[i].number;
                }

                var c = iconClass(n);
                return L.divIcon({ html: '<div><span>' + n + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
            }
        });

        // Loop through data array
        data.forEach(feature => {
            // build pop up
            var popup = "<b>" + feature.desc +
                '<br>' + feature[category] + "</b>";

            // marker icon, borrow style from marker cluster
            var markerIcon = L.divIcon({
                html: '<div><span>' + feature[category] + '</span></div>',
                className: 'marker-cluster ' + iconClass(feature[category])
            });

            // marker for each feature
            var dataMarker = L
                .marker([feature.latitude, feature.longitude], {
                    icon: markerIcon
                })
                .bindPopup(popup);
            // # of cases to feed into marker cluster marker.number
            dataMarker.number = feature[category];

            // Add marker to marker cluster
            markerCluster.addLayer(dataMarker);
        });

        // Return layer group
        return markerCluster;
        // return L.layerGroup(markerCluster);
    };

    /**
     * Function to generate legend
     * @param {string} dateString - data date
     */
    function createLegend(dateString) {
        // add layer control
        var legend = L.control({
            position: "bottomright"
        });

        // insert a div with the class of "legend"
        legend.onAdd = function () {
            // add div
            var div = L.DomUtil.create("div", "legend");

            // add date string to div
            div.innerHTML = [
                "<h2>" + dateString + "</h2>",
            ].join("");
            return div;
        };

        return legend;
    };

    /**
     * Create Map
     * @param {*} data : COVID-19 cases data
     */
    function createMap(data) {
        // Data Check
        // console.log(data);

        // Parse data
        data = parseData(data);

        // Date Filter
        data = data.filter((d) => {
            return d["date"] == selectDate;
        });
        // console.log(data);

        // Create the tile layer that will be the background of our map
        var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.light",
            accessToken: API_KEY
        });

        // Create a baseMaps object to hold the lightmap layer
        var baseMaps = {
            "Light Map": lightMap
        };

        // Create marker cluster layer
        var confirmedCases = createMarkers(data, caseFieldName);
        // var deathCases = createMarkers(data, deathFieldName);

        // Create an overlayMaps object to hold the marker layer
        // var overlayMaps = {
        //     "Confirmed Cases": confirmedCases,
        //     "Deaths": deathCases
        // };

        // Create the map object with options
        var myMap = L.map("map", {
            maxBounds: mapBounds,
            center: centerCoords,
            zoom: mapZoomLevel,
            layers: [lightMap, confirmedCases]
        });

        // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
        // L.control.layers(baseMaps, overlayMaps, {
        //     collapsed: false
        // }).addTo(myMap);
        myMap.addLayer(lightMap);
        myMap.addLayer(confirmedCases);

        // Create legend, add to map
        var dt = new Date(0);
        dt.setUTCMilliseconds(selectDate);
        var legend = createLegend(
            dt.toUTCString().split(' ').slice(0, 4).join(' ')
        );
        legend.addTo(myMap);

    };

    // Run
    // d3.csv(url, createMap);
    d3.json(url, createMap);