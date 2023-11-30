<style>
/* Global styles outside the scoped block */
.tooltip {
  position: absolute;
  z-index: 9999;
  text-align: center;
  width: auto;
  height: auto;
  padding: 10px;
  font: 12px sans-serif;
  background: white;
  border: 1px solid #000;
  border-radius: 4px;
  pointer-events: none;
  opacity: 0;
}
</style>


<template>

<div>
  <div class="correlation-box">
      <p>Correlation Coefficient:</p>
      <p class="coefficient-value">{{ correlationCoefficient }}</p>
    </div>
  <div class="main" id="main-scatter"></div>

  <div class="radio-buttons">
    <label>
      <input type="radio" v-model="selectedOption" value="All Countries" @change="updateMainScatter"> All Countries
    </label>
    <label>
      <input type="radio" v-model="selectedOption" value="Countries with Malaria Cases" @change="updateMainScatter"> Countries with Malaria Cases
    </label>
    <label>
      <input type="radio" v-model="selectedOption" value="Countries with Malaria Cases- no zero" @change="updateMainScatter"> Countries with Malaria Cases (excluding all zeros)
    </label>
    <label>
      <input type="radio" v-model="selectedOption" value="Top 10 Countries" @change="updateMainScatter"> Top 10 Countries
    </label>
  </div>
  <div class="scatter-container">
    <div class="small-scatter" id="small-scatter-1"></div>
    <div class="small-scatter" id="small-scatter-2"></div>
    <div class="small-scatter" id="small-scatter-3"></div>
    <div class="small-scatter" id="small-scatter-4"></div>
    <div class="small-scatter" id="small-scatter-5"></div>
    <div class="small-scatter" id="small-scatter-6"></div>
    <div class="small-scatter" id="small-scatter-7"></div>
    <div class="small-scatter" id="small-scatter-8"></div>
    <div class="small-scatter" id="small-scatter-9"></div>
    <div class="small-scatter" id="small-scatter-10"></div>
  </div>
</div>

</template>
<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
<script src="https://d3js.org/d3.v5.min.js"></script>
<script>
  import ChartCard from 'src/components/Cards/ChartCard.vue';
  import * as d3 from 'd3';
  import scatterData from 'src/assets/data/scatter_all_countries.json';
  import scatterDataOverZero from 'src/assets/data/scatter_mal_over_zero.json';
  import scatterDataWithZero from 'src/assets/data/scatter_mal_with_zero.json';



export default {
  components: {
   ChartCard,
   },
    data() {
      return {
        dataAll: null,
            top10: [
                "Nigeria",
                "Democratic Republic of the Congo",
                "India",
                "Mozambique",
                "Uganda",
                "Burkina Faso",
                "Ghana",
                "Niger",
                "Mali",
                "Cameroon"
            ],
            selectedOption: "All Countries",
            smallScatterData: [],
            correlationCoefficient: null
          }  
        },
 mounted() {
  this.loadData();
    },
    methods: {
      loadData() {
        this.dataAll = scatterData;   
        this.dataMAL = scatterDataOverZero;   
        this.dataMALzero = scatterDataWithZero; 
        if (this.dataAll) {
      this.updateMainScatter(); 
      this.createSmallScatterPlots();
    } else {
      console.error("Data is undefined or empty.");
    }},
    updateMainScatter() {
    var mainScatterContainer = d3.select("#main-scatter");
    mainScatterContainer.selectAll("*").remove();
    if (this.selectedOption === "All Countries") {
      this.createScatterPlot("main-scatter", this.dataAll, 700, 600);
      } else if (this.selectedOption === "Countries with Malaria Cases") {
      this.createScatterPlot("main-scatter", this.dataMALzero, 700, 600);
    } else if (this.selectedOption === "Countries with Malaria Cases- no zero") {
      this.createScatterPlot("main-scatter", this.dataMAL, 700, 600);
    } else if (this.selectedOption === "Top 10 Countries") {
      // Filter data to get only the top 10 countries
      var top10Data = this.dataAll.filter(d => this.top10.includes(d.country));
      // Update the main scatter plot to show only the top 10 countries
      this.createScatterPlot("main-scatter", top10Data, 700, 600);
    }
  },

      createSmallScatterPlots() {
        // Create small scatter plots for each country in top10
        this.top10.forEach((country, index) => {
          const countryData = this.dataAll.filter(d => d.country === country);
          this.createScatterPlot(`small-scatter-${index + 1}`, countryData, 450, 350);
          this.smallScatterData.push(countryData);
        });
      },

      createScatterPlot(containerId, data, const_width, const_height) {
          var container = d3.select("#" + containerId);
          var margin = {top: 90, right: 30, bottom: 50, left: 100},
          width = const_width - margin.left - margin.right,
          height = const_height - margin.top - margin.bottom;
          var svg = container
          .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
          .append("g")
              .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
            
            // Add X axis
            var x = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return d.gdp_per_capita; })])
            .range([ 0, width ]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(3));

            // Add Y axis
            var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return d.malaria_case_count; })])    
            .range([ height, 0 ]);
            svg.append("g")
                .call(d3.axisLeft(y).ticks(4));
            
            // Add X-axis label
            svg.append("text")
                .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 5})`)
                .style("text-anchor", "middle")
                .text("GDP per Capita (USD)");

            // Add Y-axis label
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em") 
                .style("text-anchor", "middle")
                .text("Malaria Cases");

            // Add title
            var title = "Malaria Cases vs GDP per Capita";

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -margin.top+20)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text(title);

            if (containerId.startsWith("small-scatter-")) {
                svg.append("text")
                    .attr("x", width / 2)
                    .attr("y", -margin.top + 45)
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .text(data[0].country);
            };
               
            //Color Palette from https://waldyrious.net/viridis-palette-generator/
            var hexColorArray = [
                '#fde725', '#f8e621', '#f1e51d', '#eae51a', '#e2e418',
                '#dae319', '#d2e21b', '#cde11d', '#c5e021', '#bddf26',
                '#b5de2b', '#addc30', '#a5db36', '#a0da39', '#98d83e',
                '#90d743', '#89d548', '#81d34d', '#7ad151', '#73d056',
                '#6ece58', '#67cc5c', '#60ca60', '#5ac864', '#54c568',
                '#4ec36b', '#4ac16d', '#44bf70', '#3fbc73', '#3aba76',
                '#35b779', '#31b57b', '#2db27d', '#2ab07f', '#27ad81',
                '#25ab82', '#22a884', '#21a585', '#1fa287', '#1fa188',
                '#1f9e89', '#1e9b8a', '#1f988b', '#1f958b', '#20928c',
                '#21918c', '#218e8d', '#228b8d', '#23888e', '#25858e',
                '#26828e', '#27808e', '#277e8e', '#297b8e', '#2a788e',
                '#2b758e', '#2c728e', '#2d708e', '#2e6e8e', '#2f6b8e',
                '#31688e', '#32658e', '#33628d', '#355f8d', '#365c8d',
                '#375a8c', '#39568c', '#3a538b', '#3c508b', '#3d4d8a',
                '#3e4989', '#3f4788', '#414487', '#424086', '#433d84',
                '#443983', '#453581', '#46327e', '#472f7d', '#472c7a',
                '#482878', '#482475', '#482071', '#481c6e', '#481a6c',
                '#481668', '#471164', '#470d60', '#46085c', '#450457'
            ];


            if (containerId.startsWith("main-scatter")&& this.selectedOption === "Top 10 Countries")  {

            const countries = ["Nigeria", "Democratic Republic of the Congo", "India", "Mozambique", "Uganda", "Burkina Faso", "Ghana", "Niger", "Mali", "Cameroon"];
            var color = d3.scaleOrdinal(d3.schemeTableau10).domain(countries);

            }
            else{
            var color = d3.scaleOrdinal()
                .domain(data.map(function(d) { return d.country; }))
                .range(hexColorArray);}
                
            var tooltip = d3.select("#" + containerId)
              .append("div")
              .attr("class", "tooltip")
              .html("Tooltip Content");    
            var mouseover = function(event) {
              const data = d3.select(this).data()[0];

              if (!containerId.startsWith("small-scatter-")) {
                  tooltip
                      .html("Country: " + data.country + "<br>" +
                          "Malaria Cases: " + data.malaria_case_count + "<br>" +
                          "GDP per Capita: " + data.gdp_per_capita + "<br>" +
                          "Year: " + data.year)
                      .style("left",  event.pageX - 300 + "px")
                      .style("top", event.pageY - 180 + "px")
                      .style("opacity", 1);
              }
          }

            var mouseleave = function() {
                tooltip.style("opacity", 0);
            }            

            svg.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('cx', d => x(d.gdp_per_capita))
                .attr('cy', d => y(d.malaria_case_count))  
                .attr('r', 4)
                .attr('class', 'dot')
                .style('fill', d => color(d.country))
                .on("mouseover", mouseover )
                .on("mouseleave", mouseleave );
        if (!containerId.startsWith("small-scatter-")) {
              //calculate correlation coef
              const gdpData = data.map(d => d.gdp_per_capita);
              const malariaData = data.map(d => d.malaria_case_count);
                const mean = arr => arr.reduce((acc, val) => acc + val, 0) / arr.length;
                const calculateCorrelation = (x, y) => {
                  const meanX = mean(x);
                  const meanY = mean(y);
                  const numerator = x.reduce((acc, val, i) => acc + (val - meanX) * (y[i] - meanY), 0);
                  const denominatorX = x.reduce((acc, val) => acc + Math.pow(val - meanX, 2), 0);
                  const denominatorY = y.reduce((acc, val) => acc + Math.pow(val - meanY, 2), 0);
                  const correlationCoefficient = numerator / Math.sqrt(denominatorX * denominatorY);
                  return correlationCoefficient;
                };
                const correlationCoefficient = calculateCorrelation(gdpData, malariaData);

              this.correlationCoefficient = correlationCoefficient.toFixed(2);
              console.log(containerId, this.correlationCoefficient)
      }},
      
      }}
</script>


<style scoped>
body {
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: left;
            font-family: Arial, sans-serif;
        }
        .main {
            width: 800px;
            margin: 10px;
            padding: 10px;
            box-sizing: border-box;
            position: relative;
            z-index: 1;
            border: 1px solid #ccc;
        }

        .scatter-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
            gap: 30px;
            justify-content: center;
            align-items: center;
        }

        .small-scatter {
            width: 100%;
            margin: 10px;
            display: flex;
            flex-wrap: wrap;
            border: 1px solid #ccc;
            padding: 10px;
            box-sizing: border-box;
            position: relative;
            z-index: 1;
        }

        .radio-buttons {
          margin-top: 20px;
        }

        .radio-buttons label {
          margin: 30px;
          margin-right: 50px;
          margin-top: 1px;
          margin-bottom: 50px;
        }
        .correlation-box {
          position: relative;
          width: 200px;
          height: 100px;
          margin: 10px;
          border: 1px solid #ccc;
          padding: 10px;
          margin-top: 20px;
          }

      .coefficient-value {
        font-weight: bold;
        font-size: 30px;
      }

</style>
