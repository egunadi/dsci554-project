


<template>

<div>
  <div>
    <button @click="switchMatrix('all')" :class="matrixType === 'all' ? 'active' : ''">Show All Countries</button>
    <button @click="switchMatrix('top10')" :class="matrixType === 'top10' ? 'active' : ''">Show Top 10</button>
    </div>
    <div class= "matrix" id="scatter-matrix"></div>
    
</div>

</template>
<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
<script src="https://d3js.org/d3.v4.js"></script>

<script>
  import ChartCard from 'src/components/Cards/ChartCard.vue';
  import * as d3 from 'd3';

  import scatterAll from 'src/assets/data/correlation_matrix.json';
  import scatterTop10 from 'src/assets/data/correlation_matrix_top10.json';

export default {
  data() {
    return {
      matrixType: 'all',
    }},
  components: {
   ChartCard,
   },

 mounted() {
  this.CreateScatterMatrix("#scatter-matrix", scatterAll);
    },

  methods: {

    switchMatrix(type) {
  
  if (type === 'all') {
    this.matrixType = 'all';
    this.CreateScatterMatrix("#scatter-matrix", scatterAll);
  } else if (type === 'top10') {
    this.matrixType = 'top10';
    this.CreateScatterMatrix("#scatter-matrix", scatterTop10);
  }
},
CreateScatterMatrix(containerID, jsonData) {
  d3.select(containerID).html("");

  var margin = { top: 20, right: 60, bottom: 20, left: 20 },
            width = 750 - margin.left - margin.right,
            height = 750 - margin.top - margin.bottom;

  var svg = d3.select(containerID)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var domain = [...new Set(jsonData.map(d => d.x))]; 
      
    var color = d3.scaleLinear()
    .domain([-1, -0.5, 0, 0.5, 1])
    .range(["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"]);
        
    var size = d3.scaleSqrt()
            .domain([0, 1])
            .range([0, 9]);

        var x = d3.scalePoint()
            .range([0, width])
            .domain(domain);

        var y = d3.scalePoint()
            .range([0, height])
            .domain(domain);

          var cor = svg.selectAll(".cor")
            .data(jsonData)
            .enter()
            .append("g")
            .attr("class", "cor")
            .attr("transform", function (d) {
                return "translate(" + x(d.x) + "," + y(d.y) + ")";
            });

          cor
            .filter(function(d){
            var ypos = domain.indexOf(d.y);
            var xpos = domain.indexOf(d.x);
            return xpos <= ypos;
            })
            .append("text")
            .attr("y", 5)
            .text(function(d) {
            if (d.x === d.y) {
              return d.x;
            } else {
              return d.value.toFixed(2);
            }
            })
            .style("font-size", 13)
            .style("text-align", "left")
            .style("fill", function(d){
            if (d.x === d.y) {
              return "#000";
            } else {
              return color(d.value);
            }
            });
        cor
        .filter(function (d) {
            var ypos = domain.indexOf(d.y);
            var xpos = domain.indexOf(d.x);
            return xpos > ypos;
        })
            .append("circle")
            .attr("r", function (d) { return size(Math.abs(d.value)) })
            .style("fill", function (d) {
                if (d.x === d.y) {
                    return "#000";
                } else {
                    return color(d.value);
                }
            })
            .style("opacity", 0.8);
    }
  }
}

</script>


<style scoped>
        .matrix {
            width: 800px;
            margin: 10px;
            flex-basis: 100%;
            border: 1px solid #ccc;
            padding: 10px;
            box-sizing: border-box;
            position: relative;
            background: #fbfbfb;
        }
        button {
    margin-right: 10px; /* Adjust as needed to space the buttons apart */
    padding: 8px 12px;
    background-color: #ccc;
    border: 1px solid #ccc;;
    color: black;;
    cursor: pointer;
  }

  button.active {
    background-color: #444; /* Dark grey for the active button */
    color: #fff;
  }
</style>
