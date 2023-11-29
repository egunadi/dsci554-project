var dataAll;
var top10 = [
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
        ];
d3.json("data/scatter_all_countries.json").then(function(data) {
    dataAll = data;


    const top10Data = dataAll.filter(d => top10.includes(d.country));

    createScatterPlot("main-scatter", dataAll, 700, 600);

    updateMainScatter("All Countries");

    var BurkinaData = dataAll.filter(function(d) {
    return d.country === "Burkina Faso";
    });
    var CameroonData = dataAll.filter(function(d) {
    return d.country === "Cameroon";
    });
    var CongoData = dataAll.filter(function(d) {
    return d.country === "Democratic Republic of the Congo";
    });
    var GhanaData = dataAll.filter(function(d) {
    return d.country === "Ghana";
    });
    var IndiaData = dataAll.filter(function(d) {
    return d.country === "India";
    });
    var MaliData = dataAll.filter(function(d) {
    return d.country === "Mali";
    });
    var MozaData = dataAll.filter(function(d) {
    return d.country === "Mozambique";
    });
    var NigerData = dataAll.filter(function(d) {
    return d.country === "Niger";
    });
    var NigeriaData = dataAll.filter(function(d) {
    return d.country === "Nigeria";
    });
    var UgandaData = dataAll.filter(function(d) {
    return d.country === "Uganda";
    });



    createScatterPlot("small-scatter-1", BurkinaData, 450, 350);
    createScatterPlot("small-scatter-2", CameroonData, 450, 350);
    createScatterPlot("small-scatter-3", CongoData, 450, 350);
    createScatterPlot("small-scatter-4", GhanaData, 450, 350);
    createScatterPlot("small-scatter-5", IndiaData, 450, 350);
    createScatterPlot("small-scatter-6", MaliData, 450, 350);
    createScatterPlot("small-scatter-7", MozaData, 450, 350);
    createScatterPlot("small-scatter-8", NigerData, 450, 350);
    createScatterPlot("small-scatter-9", NigeriaData, 450, 350);
    createScatterPlot("small-scatter-10", UgandaData, 450, 350);
})

var radioButtons = d3.select("body")
.insert("div", ":nth-child(3)")  
.style("margin-left", "30px")    
.selectAll(".radio-button")
.data(["All Countries", "Top 10 Countries"])
.enter()
.append("label")
.text(function(d) { return d; })
.append("input")
.attr("type", "radio")
.attr("name", "scatterOption")
.attr("class", "radio-button")
.property("checked", function (d) {
            return d === "All Countries"; 
        })
.on("change", function(d) {
  if (this.checked) {
    updateMainScatter(d);
  }
});

function updateMainScatter(selectedOption) {
    console.log(selectedOption);
var mainScatterContainer = d3.select("#main-scatter");

// Remove existing elements in the main scatter plot
mainScatterContainer.selectAll("*").remove();

if (selectedOption === "All Countries") {
    createScatterPlot("main-scatter", dataAll, 700, 600);
} else if (selectedOption === "Top 10 Countries") {
    // Filter data to get only the top 10 countries
    var top10Data = dataAll.filter(d => top10.includes(d.country));

    // Update the main scatter plot to show only the top 10 countries
    createScatterPlot("main-scatter", top10Data, 700, 600);

}




}




function createScatterPlot(containerId, data, const_width, const_height) {
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
//.domain([d3.min(data, function(d) { return d.gdp_per_capita; }), d3.max(data, function(d) { return d.gdp_per_capita; })])
    .domain([0, d3.max(data, function(d) { return d.gdp_per_capita; })])
    .range([ 0, width ]);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(3));

// Add Y axis
var y = d3.scaleLinear()
//.domain([d3.min(data, function(d) { return d.malaria_case_count; }), d3.max(data, function(d) { return d.malaria_case_count; })])
.domain([0, d3.max(data, function(d) { return d.malaria_case_count; })])    
.range([ height, 0 ]);
svg.append("g")
    .call(d3.axisLeft(y).ticks(4));

// Add X-axis label
svg.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 5})`)
    .style("text-anchor", "middle")
    .text("GDP per Capita");

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
}



var color = d3.scaleOrdinal()
    .domain(data.map(function(d) { return d.country; }))
    .range(d3.schemeCategory10);
    
//var tooltip = d3.select("body")
var tooltip = d3.select("#" + containerId)
.append("div")
.attr("class", "tooltip")
.html("Tooltip Content");

var mouseover = function(event) {
    const data = d3.select(this).data()[0];
      
    tooltip
    .html("Country: " + data.country + "<br>" +
          "Malaria Cases: " + data.malaria_case_count + "<br>" +
          "GDP per Capita: " + data.gdp_per_capita + "<br>" +
          "Year: " + data.year)
    .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
    .style("top", (d3.mouse(this)[1]) + "px")
    .style("opacity", 1);
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

//calculate correlation coef
const gdpData = data.map(d => d.gdp_per_capita);
const malariaData = data.map(d => d.malaria_case_count);

// Calculate the mean of an array
const mean = arr => arr.reduce((acc, val) => acc + val, 0) / arr.length;

// Calculate the correlation coefficient
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

console.log('Correlation Coefficient:', correlationCoefficient);



        
}