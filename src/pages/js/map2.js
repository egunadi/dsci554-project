// Initialize the map on the "map" div
var map = L.map('map').setView([20, 0], 2); // Adjust the view according to your needs

// Add a base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);


function getColor(gdp) {
    return gdp > 1e12 ? '#800026' :      // Greater than 1 trillion
           gdp > 500e9 ? '#BD0026' :     // Greater than 500 billion
           gdp > 100e9 ? '#E31A1C' :     // Greater than 100 billion
           gdp > 50e9  ? '#FC4E2A' :     // Greater than 50 billion
           gdp > 10e9  ? '#FD8D3C' :     // Greater than 10 billion
           gdp > 5e9   ? '#FEB24C' :     // Greater than 5 billion
           gdp > 1e9   ? '#FED976' :     // Greater than 1 billion
                         '#FFEDA0';      // Less than 1 billion
}

// Function to style each feature
function style(feature) {
    return {
        fillColor: getColor(feature.properties.gdp),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.ADMIN && feature.properties.gdp) {
        // Tooltip content
        var tooltipContent = `<b>${feature.properties.ADMIN}</b><br>GDP: ${feature.properties.gdp.toLocaleString()}`;

        // Binding the tooltip to the layer
        layer.bindTooltip(tooltipContent);
    }
}


function loadData(year) {
    d3.csv('../Data/newGDP.csv').then(function(data) {
        var gdpData = {};
        data.forEach(function(d) {
            if (+d.Year === +year) {
                var gdpValue = d['GDP USD'].replace(/,/g, '');
                gdpData[d.Country] = +gdpValue;
            }
        });

        d3.json('../Data/countries.geojson').then(function(geojson) {
            geojson.features.forEach(function(feature) {
                var countryName = feature.properties.ADMIN;
                feature.properties.gdp = gdpData[countryName] || 0;
            });

            // Creating GeoJSON layer with tooltip functionality
            L.geoJson(geojson, {
                style: style,
                onEachFeature: onEachFeature // Adding the onEachFeature option
            }).addTo(map);
        });
    });
}

// Initial load
loadData('2017');

// Event listener for radio buttons
document.querySelectorAll('input[name="year"]').forEach(function(radio) {
    radio.addEventListener('change', function(event) {
        map.eachLayer(function(layer) {
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });
        loadData(event.target.value);
    });
});
