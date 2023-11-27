<template>
    <div>
      <div id="map" style="width: 100%; height: 600px;"></div>
      <!-- Removed button as it's commented out in your HTML -->
      <label><input type="radio" name="year" value="2010" @change="loadData('2010')"> 2010</label>
      <label><input type="radio" name="year" value="2017" checked @change="loadData('2017')"> 2017</label>
    </div>
  </template>
  
  <script>
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import * as d3 from 'd3';
  
  


  export default {
  data() {
    return {
      map: null,
      gdpData: [
        { Country: "Burkina Faso", Year: "2010", 'GDP USD': "10,099,765,627.75", Latitude: 12.0753083, Longitude: -1.6880314 },
        { Country: "Cameroon", Year: "2010", 'GDP USD': "27,480,689,534.39", Latitude: 4.6125522, Longitude: 13.1535811 },
        { Country: "Democratic Republic of the Congo", Year: "2010", 'GDP USD': "21,565,746,507.34", Latitude: -2.9814344, Longitude: 23.8222636 },
        { Country: "Ghana", Year: "2010", 'GDP USD': "42,587,418,803.31", Latitude: 8.0300284, Longitude: -1.0800271 },
        { Country: "India", Year: "2010", 'GDP USD': "1,669,619,794,642.44", Latitude: 22.3511148, Longitude: 78.6677428 },
        { Country: "Mali", Year: "2010", 'GDP USD': "10,678,749,002.34", Latitude: 16.3700359, Longitude: -2.2900239 },
        { Country: "Mozambique", Year: "2010", 'GDP USD': "11,104,649,063.93", Latitude: -19.302233, Longitude: 34.9144977 },
        { Country: "Niger", Year: "2010", 'GDP USD': "7,631,442,274.47", Latitude: 17.7356214, Longitude: 9.3238432 },
        { Country: "Nigeria", Year: "2010", 'GDP USD': "363,359,825,763.37", Latitude: 9.6000359, Longitude: 7.9999721 },
        { Country: "Uganda", Year: "2010", 'GDP USD': "30,700,906,718.35", Latitude: 1.5333554, Longitude: 32.2166578 },
        { Country: "Burkina Faso", Year: "2017", 'GDP USD': "14,106,957,347.54", Latitude: 12.0753083, Longitude: -1.6880314 },
        { Country: "Cameroon", Year: "2017", 'GDP USD': "36,098,547,058.79", Latitude: 4.6125522, Longitude: 13.1535811 },
        { Country: "Democratic Republic of the Congo", Year: "2017", 'GDP USD': "37,642,464,496.70", Latitude: -2.9814344, Longitude: 23.8222636 },
        { Country: "Ghana", Year: "2017", 'GDP USD': "60,403,027,568.25", Latitude: 8.0300284, Longitude: -1.0800271 },
        { Country: "India", Year: "2017", 'GDP USD': "2,624,329,044,213.66", Latitude: 22.3511148, Longitude: 78.6677428 },
        { Country: "Mali", Year: "2017", 'GDP USD': "15,365,713,059.11", Latitude: 16.3700359, Longitude: -2.2900239 },
        { Country: "Mozambique", Year: "2017", 'GDP USD': "13,219,079,496.97", Latitude: -19.302233, Longitude: 34.9144977 },
        { Country: "Niger", Year: "2017", 'GDP USD': "11,185,105,960.65", Latitude: 17.7356214, Longitude: 9.3238432 },
        { Country: "Nigeria", Year: "2017", 'GDP USD': "375,744,658,045.43", Latitude: 9.6000359, Longitude: 7.9999721 },
        { Country: "Uganda", Year: "2017", 'GDP USD': "31,593,349,369.91", Latitude: 1.5333554, Longitude: 32.2166578}
      ]
    };
    
    },
    mounted() {
        
      this.initMap();
      this.loadData('2017'); // Initial load
    },
    methods: {
      initMap() {
        console.log("Initializing map...");
        this.map = L.map('map').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
      },
       getColor(gdp) {
    return gdp > 1e12 ? '#800026' :      // Greater than 1 trillion
           gdp > 500e9 ? '#BD0026' :     // Greater than 500 billion
           gdp > 100e9 ? '#E31A1C' :     // Greater than 100 billion
           gdp > 50e9  ? '#FC4E2A' :     // Greater than 50 billion
           gdp > 10e9  ? '#FD8D3C' :     // Greater than 10 billion
           gdp > 5e9   ? '#FEB24C' :     // Greater than 5 billion
           gdp > 1e9   ? '#FED976' :     // Greater than 1 billion
                         '#FFEDA0';      // Less than 1 billion
},
      style(feature) {
        
        return {
        fillColor: this.getColor(feature.properties.gdp),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
      },
      onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.name) {
    const gdpValue = feature.properties.gdp ? `$${feature.properties.gdp.toLocaleString()}` : 'No data';
    const tooltipContent = `
      <strong>${feature.properties.name}</strong><br>
      GDP: ${gdpValue}
    `;

    layer.bindTooltip(tooltipContent, {
      permanent: false,
      direction: 'auto'
    });
  }
}

,
      loadData(year) {
        console.log("Loading data for year:", year);
  var gdpValues = {};
  this.gdpData.forEach((d) => {
    if (d.Year === year) {
      var gdpValue = d['GDP USD'].replace(/,/g, '');
      gdpValues[d.Country] = +gdpValue;
      console.log(`GDP for ${d.Country}:`, gdpValue);
      
    }
  });
 


  d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then((geojson) => {
    geojson.features.forEach((feature) => {
      var countryName = feature.properties.ADMIN || feature.properties.name;
      feature.properties.gdp = gdpValues[countryName] || 0;
      
    });

            // Creating GeoJSON layer with tooltip functionality
            L.geoJson(geojson, {
      style: this.style,
      onEachFeature: this.onEachFeature
    }).addTo(this.map);
  });
      
    }
  }
};
  </script>
  
  <style>
  #map {
      width: 100%;
      height: 600px;
      border: 1px solid #AAA;
  }
  </style>
  