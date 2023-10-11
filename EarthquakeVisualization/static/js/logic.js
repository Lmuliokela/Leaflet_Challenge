// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// Define a function to calculate the color based on depth.
function getColor(depth) {
  // Define custom depth ranges and corresponding colors.
  return depth > 700 ? '#FF0000' :
         depth > 300 ? '#FF3300' :
         depth > 100 ? '#FF9900' :
         depth > 50  ? '#FFFF00' :
         depth > 30  ? '#99FF00' :
         depth > 10  ? '#66FF00' :
                       '#00FF00';
}

function createFeatures(earthquakeData) {
  // Create a GeoJSON layer with a Choropleth representation based on earthquake depth.
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      // Calculate the marker size based on magnitude.
      let markerSize = feature.properties.mag * 5; // Adjust the scale factor as needed.

      // Get the color based on depth.
      let markerColor = getColor(feature.geometry.coordinates[2]);

      // Create a custom marker with the calculated size and color.
      return L.circleMarker(latlng, {
        radius: markerSize,
        fillColor: markerColor,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function (feature, layer) {
      // Bind a popup that describes the place, time, magnitude, and depth of the earthquake.
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }
  });
