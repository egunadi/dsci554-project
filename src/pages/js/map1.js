// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to calculate the radius
function calculateRadius(value, isDeathRate = false) {
    const scaleFactor = isDeathRate ? 50 : 80;
    return Math.sqrt(value) * scaleFactor;
}

// Function to update the map based on the selected year
function updateMap(year) {
    // Clear existing layers
    map.eachLayer(function(layer) {
        if (!!layer.toGeoJSON) {
            map.removeLayer(layer);
        }
    });

    // Add OpenStreetMap tiles (again, since they were cleared)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Load data for the specified year
    d3.csv("../Data/newMalariaCases_vs_Deaths.csv").then(function(data) {
        data.forEach(function(d) {
            if (d.Year === year) {
                var cases = +d['No. of cases_median'];
                var deaths = +d['No. of deaths_median'];
                var radius = calculateRadius(cases);
                var deathRate = deaths / cases;
                var deathRadius = calculateRadius(deathRate, true);
                var opacityScale = 0.2;
                var fillOpacity = Math.min(deathRate * opacityScale, 1);

                var tooltipContent = "<b>Country:</b> " + d.Country +
                    "<br><b>Cases:</b> " + cases +
                    "<br><b>Deaths:</b> " + deaths;
                console.log("radius:",radius);
                var casesCircle = L.circle([+d.Latitude, +d.Longitude], {
                    color: 'red',
                    fillColor: 'red',
                    fillOpacity: fillOpacity * 1000,
                    radius: radius
                }).bindTooltip(tooltipContent).addTo(map);
                console.log(deathRadius);
                new_radius = deathRadius*10000;
                console.log("new radius:",new_radius);
                var deathCircle = L.circle([+d.Latitude, +d.Longitude], {
                    color: 'blue',
                    fillColor: 'blue',
                    fillOpacity: 0.5,
                    radius: new_radius
                }).bindTooltip(tooltipContent).addTo(map);
            }
        });
    });

    // Update the legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += '<i style="background: red; border-radius: 50%; width: 10px; height: 10px; display: inline-block;"></i> Cases of Malaria<br>';
        div.innerHTML += '<i style="background: blue; border-radius: 50%; width: 10px; height: 10px; display: inline-block;"></i> Deaths by Malaria<br>';
        return div;
    };

    // Remove any old legends and add the new legend
    var oldLegend = document.querySelector('.legend');
    if (oldLegend) {
        oldLegend.parentNode.removeChild(oldLegend);
    }
    legend.addTo(map);
}

// Event listener for the radio buttons
document.querySelectorAll('input[type=radio][name="year"]').forEach(radio => {
    radio.addEventListener('change', function() {
        updateMap(this.value);
    });
});

// Initial map load with the default year (2015)
updateMap("2010");


