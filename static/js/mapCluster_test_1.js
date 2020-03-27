var myMap = L.map("map", {
    center: [41.87, -87.62],
    zoom: 4
  });
  
// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);
  

url = "./merge_counties_and_ coordinates.csv";
d3.csv(url, function(data) {
    data = data.filter(function(selectDate) {
        return selectDate["date"] == "2020-03-22";
    });
    console.log(data);


var markers = L.markerClusterGroup(
    // {
    // maxClusterRadius: 120,
    // iconCreateFunction: function (cluster) {
    //     var markers = cluster.getAllChildMarkers();
    //     var n = 0;
    //     for (var i = 0; i < markers.length; i++) {
    //         n += markers[i].number;
    //     }
    //     return L.divIcon({ html: n, className: 'mycluster', iconSize: L.point(40, 40) });
    // },
    // // Disable all of the defaults:
    // spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false

    // }
    );
    

    

for ( var i = 0; i < data.length; ++i )
{
var popup = data[i].date +
            '<br/>' + data[i].county +
            '<br/>' + data[i].cases;

var m = L.marker( [data[i].latitude, data[i].longitude])
                .bindPopup(popup);

markers.addLayer(m);
}

myMap.addLayer(markers);
});