<template>
    <div>
      <div id="map" style="width: 100%; height: 600px;"></div>
      <label><input type="radio" name="year" value="2010" @change="updateMap('2010')"> 2010</label>
      <label><input type="radio" name="year" value="2017" @change="updateMap('2017')" checked> 2017</label>
    </div>
  </template>
  
  <script>
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  
  export default {
    data() {
      return {
        map: null,
        malariaData: [
        { Country: "Burkina Faso", Year: "2010", 'No. of cases_median': 9221846, 'No. of deaths_median': 43695, Latitude: 12.0753083, Longitude: -1.6880314 },
        { Country: "Cameroon", Year: "2010", 'No. of cases_median': 5361329, 'No. of deaths_median': 12340, Latitude: 4.6125522, Longitude: 13.1535811 },
        { Country: "Democratic Republic of the Congo", Year: "2010", 'No. of cases_median': 23691683, 'No. of deaths_median': 62375, Latitude: -2.9814344, Longitude: 23.8222636 },
        { Country: "Ghana", Year: "2010", 'No. of cases_median': 9171294, 'No. of deaths_median': 15241, Latitude: 8.0300284, Longitude: -1.0800271 },
        { Country: "India", Year: "2010", 'No. of cases_median': 20490000, 'No. of deaths_median': 30930, Latitude: 22.3511148, Longitude: 78.6677428 },
        { Country: "Mali", Year: "2010", 'No. of cases_median': 5772983, 'No. of deaths_median': 17725, Latitude: 16.3700359, Longitude: -2.2900239 },
        { Country: "Mozambique", Year: "2010", 'No. of cases_median': 8455521, 'No. of deaths_median': 17542, Latitude: -19.302233, Longitude: 34.9144977 },
        { Country: "Niger", Year: "2010", 'No. of cases_median': 7007707, 'No. of deaths_median': 21750, Latitude: 17.7356214, Longitude: 9.3238432 },
        { Country: "Nigeria", Year: "2010", 'No. of cases_median': 60749349, 'No. of deaths_median': 146734, Latitude: 9.6000359, Longitude: 7.9999721 },
        { Country: "Uganda", Year: "2010", 'No. of cases_median': 11503116, 'No. of deaths_median': 21558, Latitude: 1.5333554, Longitude: 32.2166578 },
        { Country: "Burkina Faso", Year: "2017", 'No. of cases_median': 7907562, 'No. of deaths_median': 27791, Latitude: 12.0753083, Longitude: -1.6880314 },
        { Country: "Cameroon", Year: "2017", 'No. of cases_median': 7307515, 'No. of deaths_median': 11566, Latitude: 4.6125522, Longitude: 13.1535811 },
        { Country: "Democratic Republic of the Congo", Year: "2017", 'No. of cases_median': 25021891, 'No. of deaths_median': 46007, Latitude: -2.9814344, Longitude: 23.8222636 },
        { Country: "Ghana", Year: "2017", 'No. of cases_median': 7805045, 'No. of deaths_median': 10917, Latitude: 8.0300284, Longitude: -1.0800271 },
        { Country: "India", Year: "2017", 'No. of cases_median': 9590000, 'No. of deaths_median': 16733, Latitude: 22.3511148, Longitude: 78.6677428 },
        { Country: "Mali", Year: "2017", 'No. of cases_median': 7160192, 'No. of deaths_median': 14000, Latitude: 16.3700359, Longitude: -2.2900239 },
        { Country: "Mozambique", Year: "2017", 'No. of cases_median': 10025823, 'No. of deaths_median': 14713, Latitude: -19.302233, Longitude: 34.9144977 },
        { Country: "Niger", Year: "2017", 'No. of cases_median': 7702777, 'No. of deaths_median': 17155, Latitude: 17.7356214, Longitude: 9.3238432 },
        { Country: "Nigeria", Year: "2017", 'No. of cases_median': 53667565, 'No. of deaths_median': 81640, Latitude: 9.6000359, Longitude: 7.9999721 },
        { Country: "Uganda", Year: "2017", 'No. of cases_median': 8600724, 'No. of deaths_median': 14390, Latitude: 1.5333554, Longitude: 32.2166578}
          
        ]
      };
    },
    mounted() {
      this.initMap();
      this.updateMap('2010'); // Set the initial year
    },
    methods: {
      initMap() {
        this.map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
      },
      calculateRadius(value, isDeathRate = false) {
        const scaleFactor = isDeathRate ? 50 : 80;
        return Math.sqrt(value) * scaleFactor;
      },
      updateMap(year) {
        console.log("Updating map for year:", year);
  
        // Clear existing layers
        this.map.eachLayer((layer) => {
          if (layer.toGeoJSON) {
            this.map.removeLayer(layer);
          }
        });
  
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
  
        this.malariaData.forEach((d) => {
          if (d.Year === year) {
            const cases = +d['No. of cases_median'];
            const deaths = +d['No. of deaths_median'];
            const radius = this.calculateRadius(cases);
            const deathRate = deaths / cases;
            const deathRadius = this.calculateRadius(deathRate, true);
            const fillOpacity = Math.min(deathRate * 0.2, 1);
            
            const tooltipContent = `
            <strong>${d.Country}</strong><br>
            Cases: ${cases.toLocaleString()}<br>
            Deaths: ${deaths.toLocaleString()}
          `;

            L.circle([+d.Latitude, +d.Longitude], {
              color: 'red',
              fillColor: 'red',
              fillOpacity: fillOpacity,
              radius: radius
            }).bindTooltip(tooltipContent).addTo(this.map);
  
            L.circle([+d.Latitude, +d.Longitude], {
              color: 'blue',
              fillColor: 'blue',
              fillOpacity: 0.5,
              radius: deathRadius
            }).bindTooltip(tooltipContent).addTo(this.map);
          }
        });
  
        const legend = L.control({ position: 'bottomright' });
  
        legend.onAdd = () => {
          const div = L.DomUtil.create('div', 'info legend');
          div.innerHTML += '<i style="background: red; border-radius: 50%; width: 10px; height: 10px; display: inline-block;"></i> Cases of Malaria<br>';
          div.innerHTML += '<i style="background: blue; border-radius: 50%; width: 10px; height: 10px; display: inline-block;"></i> Deaths by Malaria<br>';
          return div;
        };
  
        const oldLegend = document.querySelector('.legend');
        if (oldLegend) {
          oldLegend.parentNode.removeChild(oldLegend);
        }
        legend.addTo(this.map);
      }
    }
  };
  </script>
  
  <style>
  #map {
      height: 100%;
      width: 100%;
  }
  </style>
  