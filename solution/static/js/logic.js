// Im using the magnitude 2.5+ earthquakes in the past 30 days 
const json_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

// fetch the data
d3.json(json_url).then((json_data) => {
    // console.log(json_data.features);
    format_features(json_data.features)

})

function create_map(layerInfo) {

    var OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const base = {
        'StreetMap': OpenStreetMap_Mapnik
    }

    const overlays = {
        Earthquakes: layerInfo
    }

    var the_map = L.map('map', {
        center: [36.7126875, -120.476189],
        zoom: 4,
        layers: [OpenStreetMap_Mapnik, layerInfo]
    });

    L.control.layers(base, overlays, {
        collapsed: false
    }).addTo(the_map);

    // legend

    // var legend = L.control({
    //     position: "bottomleft",
    //     colors: ["#eddfdf", "#ff9292", "#ff7272", "#b92525", "#540909"],
    //     labels: ["0 <= Depth < 5", "5 <= Depth < 10", "10 <= Depth < 15", "15 <= Depth < 20", " 20 < Depth"],
    //     title: "Legend"
    // });

    // L.control.Legend({
    //     position: "bottomleft",
    //     legends: [{
    //         label: "test",
    //     }]
    //     // colors: ["#eddfdf", "#ff9292", "#ff7272", "#b92525", "#540909"],
    //     // labels: ["0 <= Depth < 5", "5 <= Depth < 10", "10 <= Depth < 15", "15 <= Depth < 20", "20 < Depth"],
    //     // title: "Legend"
    // }).addTo(the_map);

    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function (map) {
        const div = L.DomUtil.create("div", "legend")
        div.innerHTML += "<h4>Legend</h4>";
        div.innerHTML += '<i style="background: #EDDFDF"></i><span>0 <= Depth < 5</span><br>';
        div.innerHTML += '<i style="background: #ff9292"></i><span>5 <= Depth < 10</span><br>';
        div.innerHTML += '<i style="background: #ff7272"></i><span>10 <= Depth < 15</span><br>';
        div.innerHTML += '<i style="background: #b92525"></i><span>15 <= Depth < 20</span><br>';
        div.innerHTML += '<i style="background: #540909"></i><span>20 < Depth</span><br>';

        return div;
    }

    legend.addTo(the_map);

    // legend.onAdd = function (the_map) {
    //     const div = L.DomUtil.create("div", "info legend")
    //     const depths = [0, 5, 10, 15, 20]
    //     const labels = ["#eddfdf", "#ff9292", "#ff7272", "#b92525", "#540909"]

    //     for (let i = 0; i < depths.length; i++) {
    //         div.innerHTML += '<i style="background:' + labels[i] + '"></i>' + depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    //     }

    //     return div;
    // }

    // legend.addTo(the_map);

}

function format_features(feature_data) {
    // add popups with additional info
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><h4>Date: " + new Date(feature.properties.time) + "</h4><h4>Earthquake magnitude: " + feature.properties.mag + "</h4>" + "<h4>Earthquake depth: " + feature.geometry.coordinates[2] + "</h4>");
    }

    function pointToLayer(feature, coords) {
        let radius = feature.properties.mag * 2.5
        let depth = coords.alt;

        // set color for the depth
        if (depth >= 0 && depth < 5) {
            color = "#eddfdf";
        } else if (depth >= 5 && depth < 10) {
            color = "#ff9292";
        } else if (depth >= 5 && depth < 10) {
            color = "#ff7272"
        } else if (depth >= 15 && depth < 20) {
            color = "#b92525";
        } else {
            color = "#540909";
        }

        return L.circleMarker(coords, {
            radius: radius,
            color: "#000000",
            fillColor: color,
            fillOpacity: 0.5,
            weight: 1
        })
    }

    const layerToMap = L.geoJSON(feature_data, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    })

    // const layerToMap = L.geoJSON(feature_data, {
    //     onEachFeature: onEachFeature,
    //     pointToLayer: function (feature, coords) {
    //         let radius = feature.properties.mag * 2.5
    //         let longitude = coords[0];
    //         let latitude = coords[1];
    //         let depth = coords[2];

    //         // set color for the depth (values range from [0, 1000])
    //         if (depth >= 0 && depth < 200) {
    //             color = "#630505";
    //         } else if (depth >= 200 && depth < 400) {
    //             color = "#8f0f0f";
    //         } else if (depth >= 600 && depth < 800) {
    //             color = "#e12d2d";
    //         } else {
    //             color = "#f29494";
    //         }

    //         return L.circleMarker(coords, {
    //             radius: radius,
    //             color: 'black',
    //             fillColor: color,
    //             fillOpacity: 1,
    //             weight: 1
    //         })
    //     }

    // })

    create_map(layerToMap);

}
