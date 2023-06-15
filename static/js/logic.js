// GeoJSON URL
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Obtain data from url
d3.json(url).then(data =>
{
    // Log data to the console
    console.log(data)

    // Initialize map
    let map = L.map("map")
               .setView([37.09, -95.71],5)
    
    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {attribution:`&copy; <a href="https://www.openstreetmap.org/copyright">
                 OpenStreetMap</a> contributors`})
    .addTo(map)

    // Add markers to map
    L.geoJSON(data,
        {
            onEachFeature:onEachFeature
        })
    .addTo(map)

    // Create popup message for each marker
    function onEachFeature(feature,layer)
    {
        let mag = feature.properties.mag
        let pla = feature.properties.place
        let dep = feature.geometry.coordinates[2]
        layer.bindPopup(`<text>Magnitude: ${mag}</text><br>
                         <text>Location: ${pla}</text><br>
                         <text>Depth: ${dep}km</text>`)
    }
})