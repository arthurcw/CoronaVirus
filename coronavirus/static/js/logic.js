//Leaflet marker cluster group
//zoom in/out map
//cesium is alternative to leaflet, and can do 3d

// Creating map object
var myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 11
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// TODO:

// // Store API query variables
// // var baseURL = "https://data.cityofnewyork.us/resource/fhrw-4uyv.json?";
// var baseURL = "https://data.cityofnewyork.us/resource/erm2-nwe9.json?";
// // Add the dates in the ISO formats
// var date = "$where=created_date between '2016-01-01T00:00:00.000' and '2020-04-01T00:00:00.000'";
// // Add the complaint type
// var complaint = "&complaint_type=Rodent";
// // Add a limit
// var limit = "&$limit=10000";

// // Assemble API query URL
// var apiQuery = baseURL + date + complaint + limit;
// // console.log(apiQuery);

// Grab the data with d3
d3.csv("../../data/time_series-ncov-Confirmed.csv", function(data) {
  console.log(data);

  // Create a new marker cluster group
  let markers = L.markerClusterGroup();

  // Loop through data
    data.forEach(function(feature) {
      let location = feature.Lat;
      // console.log(location);
      if (location) {
        markers.addLayer(
          L.marker([feature.Lat, feature.Long])
            .bindPopup(feature.Value)
        );
      };
    });
    myMap.addLayer(markers);

});

// d3.json(apiQuery, function(data) {
// // Grab the data with d3
//     console.log(data);

//     // Create a new marker cluster group
//     let markers = L.markerClusterGroup();

//     // Loop through data
//     data.forEach(function(feature) {
//       let location = feature.location;
//       // console.log(location);
//       if (location) {
//         markers.addLayer(
//           L.marker([location.latitude, location.longitude])
//             .bindPopup(feature.incident_address)
//         );
//       };
//     });
//     myMap.addLayer(markers);

//     // Set the data location property to a variable

//     // Check for location property

//       // Add a new marker to the cluster group and bind a pop-up

//   // Add our marker cluster layer to the map
// });