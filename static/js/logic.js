// GeoJSON URL
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Obtain data from url
d3.json(url)
.then(data =>
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
            onEachFeature:onEachFeature,
            pointToLayer:pointToLayer
        })
    .addTo(map)

    // Create popup message for each marker on click
    function onEachFeature(feature,layer)
    {
        let mag = feature.properties.mag
        let pla = feature.properties.place
        let dep = feature.geometry.coordinates[2]
        layer.bindPopup(`<text>Magnitude: ${mag}</text><br>
                         <text>Location: ${pla}</text><br>
                         <text>Depth: ${dep}km</text>`)
    }

    // Turn markers into circles
    function pointToLayer(feature,latlng)
    {
        let mag = feature.properties.mag*5
        let dep = feature.geometry.coordinates[2]
        return L.circleMarker(latlng,
            {
                // Circle radius based on earthqake magnitude
                radius:mag,

                // Circle fillColor based on earthquake depth
                fillColor: getColor(dep),
                
                color: "#000",
                weight: 0.25,
                opacity: 1,
                fillOpacity: 1
            })
    }

    // Give circles dynamic fillColor based on earthquake depth
    function getColor(d)
    {
        return d > 90 ? '#ff0000' :
               d > 70 ? '#FF5C14' :
               d > 50 ? '#FF8A1B' :
               d > 30 ? '#FCD514' :
               d > 10 ? '#98DA00' :
               d > -10 ? '#1FD224' : '#FFEDA0'
    }

    // Initialize map legend
    let legend = L.control({position:"bottomright"})

    // Define legend attributes and HTML inserts
    // Refer to CSS for additional legend attributes
    legend.onAdd = function(map)
    {
        let div = L.DomUtil.create("div","info legend")

        // Legend header
        div.innerHTML += `<h4>Depth (km)</h4><br>`

        // Legend contents
        let depths = ["-10-10","10-30","30-50","50-70","70-90","90+"]
        let colors = 
        [
            "background:#1FD224",
            "background:#98DA00",
            "background:#FCD514",
            "background:#FF8A1B",
            "background:#FF5C14",
            "background:#FF0000"
        ]

        for (const i in depths)
        {
            div.innerHTML += `<i style=${colors[i]}></i>${depths[i]}<br>`
        }

        return div
    }

    // Add legend to map
    legend.addTo(map)

    // Initialize info control
    let info = L.control({position:"topright"})

    // Define info attributes and HTML inserts
    info.onAdd = function(map)
    {
        let div = L.DomUtil.create("div","info legend")
        div.innerHTML += `<h1>Earthquakes (7 days)</h1>`
        div.innerHTML += `<h3>Click on a circle to view info</h3>`
        div.innerHTML += `<h3>Circle radii are based on Magnitude</h3>`
        return div
    }

    // Add info to map
    info.addTo(map)
})