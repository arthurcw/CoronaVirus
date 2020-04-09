// Generate map where countries have no reported cases

function createMapNoCase(data) {
    // Map initialization parameters
    const centerCoords = [20, 0];
    const mapBounds = [[90,-180], [-90, 180]];
    const mapZoomLevel = 2;

    // Parse data
    data.forEach(d => {
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;
    })

    // Create the tile layer that will be the background of our map
    var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Create marker layer
    //custom icons
    var customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div class='marker-pin'></div><i class='fas fa-sun fa-2x'></i>",
        iconSize: [30, 42],
        iconAnchor: [15, 15]
    })

    //marker array
    var noCaseMarkers = [];
    data.forEach(d=> {
        let marker = L
            .marker([d.latitude, d.longitude], { icon: customIcon })
            .bindPopup("<b>" + d.iso_country + "</b>"
                + (d.population > 0 ? "<br> Population: " + casesNumFormat(d.population) : ""));
        noCaseMarkers.push(marker);
    })
    //marker array to layer
    dataLayer = L.layerGroup(noCaseMarkers);

    // Create the map object
    var myMap = L.map("mapNoCase", {
        maxBounds: mapBounds,
        center: centerCoords,
        zoom: mapZoomLevel,
        layers: [lightMap, dataLayer]
    });
    myMap.addLayer(lightMap);
    myMap.addLayer(dataLayer);
};

// Run
d3.json('/api/NoCasesCountry').then(data=> {
    createMapNoCase(data.countries);
});