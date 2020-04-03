// Source of data
const urlMap = "http://127.0.0.1:5000/dataCovid19Latest";
const caseFieldName = "cases";     // field name of confirmed cases
const deathFieldName = "death";    // field name of deaths
const countriesDetail = ["US", "Australia", "Canada", "China"];

// Map initialization parameters
const centerCoords = [20, 0];
const mapBounds = [[90,-180], [-90, 180]];
const mapZoomLevel = 2;
const mapZoomLevelLocal = 7;
var casesNumFormat = d3.format(",.0f");

// Function to parse data
function parseData(data) {
    data.forEach(d => {
        d.date = +d.date;   // data came in from PostgreSQL as unix time stamp in milliseconds
        d.cases = +d.cases;
        d.death = +d.death;
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;

        // for tooltip
        if (d.province_state === null) {
            // country-level data
            d.desc = d.country_region;
        } else if (d.admin2 === null) {
            // state/province level data
            d.desc = d.province_state;
        } else {
            // local level data (for the US)
            d.desc = d.admin2 + ", " + d.province_state;
        };
    });
    return data;
}

/**
 * function to query local level data by country
 * @param {*} data - Covid 19 data
 * @param {string} country - country of interest
 * @param {string} markerLevel - marker level (field name: admin2, province_state or country_region)
 */
function queryLocalData(data, country, markerLevel) {
    if (markerLevel === "admin2") {
        return data.filter((d) => {
            return d.country_region === country & d[markerLevel] != null;
        });
    } else if (markerLevel === "province_state") {
        return data.filter((d) => {
            return d.country_region === country & d[markerLevel] != null & d.admin2 === null;
        });
    }
}

// function to query country-level data for rest of world
function queryCountryData(data) {
    return data.filter((d) => {
        return (d.admin2 === null & d.province_state === null)
            & d.country_region != "US" & d.country_region != "Australia"
            & d.country_region != "Canada" & d.country_region != "China";
    });
}

// assign marker-cluster icon class
function iconClass(count) {
    var c = ' marker-custom-';
	if (count < 10) {
		c += '10';
	} else if (count < 100) {
        c += '100';
    } else if (count < 1000) {
		c += '1000';
	} else {
		c += '10000';
    };
    return c;
};

/**
 * Create marker layer group
 * @param {*} data : COVID-19 data
 * @param {string} category: data category (# of confirmed cases or deaths)
 */
function createMarkers(data, category) {
    // Create Marker Cluster
    var markerCluster = L.markerClusterGroup({
        maxClusterRadius: 100,
        iconCreateFunction: function (cluster) {
            var markers = cluster.getAllChildMarkers();
			var n = 0;
			for (var i = 0; i < markers.length; i++) {
				n += markers[i].number;
            }

            var c = iconClass(n);
            return L.divIcon({ 
                html: '<div><span>' + casesNumFormat(n) + '</span></div>',
                className: 'marker-custom' + c,
                iconSize: new L.Point(40, 40)
            });
        }
    });

    // Loop through data array
    data.forEach(feature => {
        // build pop up
        var popup = "<b>" + feature.desc + "</b>" + "<br>" +
            "Confirmed Cases: " + casesNumFormat(feature[caseFieldName]) + "<br>" +
            "# of Deaths: " + casesNumFormat(feature[deathFieldName]);

        // marker icon, borrow style from marker cluster
        var markerIcon = L.divIcon({
            html: '<div><span>' + casesNumFormat(feature[category]) + '</span></div>',
            className: 'marker-custom ' + iconClass(feature[category]),
            iconSize: new L.Point(40, 40)
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

    // Return marker cluster
    return markerCluster;
};

/**
 * Function to generate legend
 * @param {string} dateString - data date
 */
function createDateLabel(dateString) {
    // add layer control
    var label = L.control({
        position: "bottomright"
    });

    // insert a div with the class of "legend"
    label.onAdd = function() {
        // add div
        var div = L.DomUtil.create("div", "legend");

        // add date string to div
        div.innerHTML = [
            "<h2>" + dateString + "</h2>",
        ].join("");
        return div;
    };

    return label;
};

/**
 * Create Map
 * @param {*} data : COVID-19 cases data
 */
function createMap(data) {
    // Parse data
    data = parseData(data);

    // Create the tile layer that will be the background of our map
    var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
    // var baseMaps = {
    //     "Light Map": lightMap
    // };

    // Create marker cluster layer
    // 1. Divide data into buckets/data groups
    // US, Australia, Canada and China have local data
    // These countries have their own marker cluster
    var dataGroup = [];
    countriesDetail.forEach((country) => {
        dataGroup[country] = queryLocalData(data, country, "province_state")
    });
    dataGroup["ROW"] = queryCountryData(data);

    // 1b. local-level data for the US
    var localDataUS = queryLocalData(data, "US", "admin2");

    // 2. Create marker/marker-cluster layers
    // 2a. confirmed cases
    var caseMarkerGroup = [];
    countriesDetail.forEach((country) => {
        caseMarkerGroup[country] = createMarkers(dataGroup[country], caseFieldName);
    });
    caseMarkerGroup["ROW"] = createMarkers(dataGroup["ROW"], caseFieldName);
    var caseMarkerLocal = createMarkers(localDataUS, caseFieldName);

    // 2b. death cases
    // var deathMarkerGroup = [];
    // countriesDetail.forEach((country) => {
    //     deathMarkerGroup[country] = createMarkers(dataGroup[country], deathFieldName);
    // });
    // deathMarkerGroup["ROW"] = createMarkers(dataGroup["ROW"], caseFieldName);
    // var deathMarkerLocal = createMarkers(localDataUS, caseFieldName);

    // Group data layers
    dataLayers = [lightMap];
    countriesDetail.forEach((country)=> {
        dataLayers.push(caseMarkerGroup[country]);
    });
    dataLayers.push(caseMarkerGroup["ROW"]);

    // Create the map object
    var myMap = L.map("map", {
        maxBounds: mapBounds,
        center: centerCoords,
        zoom: mapZoomLevel,
        layers: dataLayers
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    // L.control.layers(baseMaps, overlayMaps, {
    //     collapsed: false
    // }).addTo(myMap);

    // Add Layers into map
    dataLayers.forEach((layer)=> {
        myMap.addLayer(layer);
    })

    // Layer Display Control: Show local US data when zoomed in
    myMap.on("zoomend", function() {
        if (myMap.getZoom()>mapZoomLevelLocal) {
            myMap.removeLayer(caseMarkerGroup["US"]);
            myMap.addLayer(caseMarkerLocal);
        } else {
            myMap.addLayer(caseMarkerGroup["US"]);
            myMap.removeLayer(caseMarkerLocal);
        };
    })

    // Zoom to specific region
    var listRegion = d3.select("#regionList");
    listRegion.on("change", function() {
        switch (d3.event.target.value) {
            case "world":
                myMap.fitBounds(mapBounds);
                myMap.setZoom(mapZoomLevel);
                break;
            case "Af":
                myMap.fitBounds([[36.348513, -18.703848], [-35.570013, 52.399663]]);
                break;
            case "AS":
                myMap.fitBounds([[62.055357, 33.326535], [-0.573183, 149.345067]]);
                break;
            case "Eu":
                myMap.fitBounds([[70.753046, -23.662475], [35.884345, 40.035488]]);
                break;
            case "NA":
                myMap.fitBounds([[65.387976, -156.756322], [18.601869, -52.956325]]);
                break;
            case "SA":
                myMap.fitBounds([[13.162969, -85.471932], [-54.728644, -34.890289]]);
                break;
        };

    });

    // Add data date stamp to bottom right
    var dt = new Date(data[0].date);
    var dateLabel = createDateLabel(
        dt.toUTCString().split(' ').slice(0, 4).join(' ')
        );
    dateLabel.addTo(myMap);

    // # of Countries, Confirmed Case and Death number for statistics at bottom of map
    var nCases = 0;
    var nDeath = 0;
    for (i in dataGroup) {
        dataGroup[i].forEach((row) => {
            nCases += row[caseFieldName];
            nDeath += row[deathFieldName];
        });
    };
    d3.select("#countries").text(dataGroup.ROW.length + 4 - 2);
    d3.select("#confirmedCases").text(casesNumFormat(nCases));
    d3.select("#deaths").text(casesNumFormat(nDeath));
};

// Run
d3.json(urlMap).then(data => {
    createMap(data);
});