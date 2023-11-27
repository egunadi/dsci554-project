<template>
<div>
    <div id="legend-container"></div>
    <div class="charts-container">
        <div class="chart-container">
            <h2>Malaria Number of Cases Time Series Visualizations</h2>
            <div id="cases-chart" class="chart"></div>
        </div>
        <div class="chart-container">
            <h2>Malaria Number of Deaths Time Visualizations</h2>
            <div id="deaths-chart" class="chart"></div>
        </div>
        <div class="chart-container">
            <h2>GDP Per Capita Time Series Visualizations</h2>
            <div id="gdp-chart" class="chart"></div>
        </div>
        <div class="chart-container">
            <h2>Country Population Time Series Visualizations</h2>
            <div id="population-chart" class="chart"></div>
        </div>
    </div>
    <div class="tooltip" id="tooltip"></div>
</div>
</template>

<script>
import ChartCard from 'src/components/Cards/ChartCard.vue';
import * as d3 from 'd3';
import tableData from 'src/assets/data/Malaria and GDP Data 2010-2017 with GDP per Capita.json';

const tableColumns = ['Country', 'Year', 'No. of cases', 'No. of deaths', 'No. of cases_median', 'No. of cases_min', 'No. of cases_max', 'No. of deaths_median', 'No. of deaths_min', 'No. of deaths_max', 'WHO Region', 'Reported No. of Cases', 'Reported No. of deaths', 'Changes in inventories', 'Exports of goods and services', 'Final consumption expenditure', 'General government final consumption expenditure', 'GDP National Currency', 'Gross capital formation', 'Gross fixed capital formation (including Acquisitions less disposals of valuables)', 'Household consumption expenditure (including Non-profit institutions serving households)', 'Imports of goods and services', 'GDP USD', 'Population', 'GDP_per_capita']

export default {
    components: {
        ChartCard
    },
    data() {
        return {
            editTooltip: 'Edit Task',
            deleteTooltip: 'Remove',
            populationChartData: {}, // Data for Population chart
            casesChartData: {}, // Data for No. of cases chart
            gdpChartData: {}, // Data for GDP_per_capita chart
            deathsChartData: {}, // Data for No. of deaths chart
            lineChart: {
                options: {
                    low: 0,
                    high: 800,
                    showArea: false,
                    height: '245px',
                    axisX: {
                        showGrid: false
                    },
                    lineSmooth: true,
                    showLine: true,
                    showPoint: true,
                    fullWidth: true,
                    chartPadding: {
                        right: 50
                    }
                },
                responsiveOptions: [
                    ['screen and (max-width: 640px)', {
                        axisX: {
                            labelInterpolationFnc(value) {
                                return value[0]
                            }
                        }
                    }]
                ]
            }
        };
    },
    mounted() {
        this.loadChartData();
    },
    methods: {
        loadChartData() {
            console.log("Loading chart data...");
            // Filter data for the specified countries
            const countriesToInclude = [
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

            this.drawLineChart(tableData, "Population", "population-chart");
            this.drawLineChart(tableData, "No. of cases", "cases-chart");
            this.drawLineChart(tableData, "GDP_per_capita", "gdp-chart");
            this.drawLineChart(tableData, "No. of deaths", "deaths-chart");
            this.createLegend();
        },
        calculatePercentageChange(data, attribute) {
            data.sort((a, b) => a.Year - b.Year);
            for (let i = 1; i < data.length; i++) {
                // Extract the first number from the string
                let prevValue = parseFloat(data[i - 1][attribute]);
                let currentValue = parseFloat(data[i][attribute]);

                // Calculate the percentage change if the previous value is not zero
                if (prevValue !== 0) {
                    data[i].percentChange = ((currentValue - prevValue) / prevValue) * 100;
                } else {
                    data[i].percentChange = 0; // Handle division by zero if the previous value is zero
                }
            }
            // Handle the first element separately
            data[0].percentChange = 0; // No change as there is no previous value
        },
        createLegend() {
            const countries = ["Nigeria", "Democratic Republic of the Congo", "India", "Mozambique", "Uganda", "Burkina Faso", "Ghana", "Niger", "Mali", "Cameroon"];
            const colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(countries);

            const legendContainer = d3.select("#legend-container");
            const parentWidth = legendContainer.node().getBoundingClientRect().width;
            const legendSvg = legendContainer.append("svg")
                .attr("width", parentWidth)
                .attr("height", 70);

            countries.forEach((country, index) => {
                const xPosition = (index % 5) * 250;
                const yPosition = Math.floor(index / 5) * 30;

                const legendItem = legendSvg.append("g")
                    .attr("transform", `translate(${xPosition}, ${yPosition})`);

                // Colored rectangle for the legend
                legendItem.append("rect")
                    .attr("width", 15)
                    .attr("height", 15)
                    .attr("fill", colorScale(country))
                    .attr("y", 8);

                const className = `line-${country.split(' ').join('-')}`;
                // Checkbox input
                legendItem.append("foreignObject")
                    .attr("width", 20)
                    .attr("height", 20)
                    .attr("x", 20) // Adjust x position to be next to the colored rectangle
                    .attr("y", 5)
                    .append("xhtml:body")
                    .html(`<form><input type="checkbox" id="checkbox-${className}" checked></form>`);

                // Checkbox label
                legendItem.append("text")
                    .attr("x", 45) // Adjust x position to be next to the checkbox
                    .attr("y", 22)
                    .text(country)
                    .attr("font-size", "13px")
                    .attr("text-anchor", "start");

                // Use an arrow function to maintain the correct 'this' scope
                d3.select(`#checkbox-${className}`).on("change", () => {
                    this.handleCheckboxChange(country, event.target.checked);
                });
            });
        },
        handleCheckboxChange(country, isChecked) {
            // Replace spaces with hyphens for the class selector
            console.log("handleCheckboxChange");
            const className = `line-${country.split(' ').join('-')}`;

            // Select all lines associated with the country
            const lines = d3.selectAll(`.${className}`);

            if (!isChecked) {
                // If unchecked, set display property to "none"
                lines.style("display", "none");
            } else {
                // If checked, set it to "block"
                lines.style("display", "block");
            }
        },
        drawLineChart(data, attribute, chartId) {
            const countries = ["Nigeria", "Democratic Republic of the Congo", "India", "Mozambique", "Uganda", "Burkina Faso", "Ghana", "Niger", "Mali", "Cameroon"];
            console.log(data)
            const colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(countries);
            let allYears = new Set();
            let processedData = [];

            countries.forEach(country => {
                let countryData = data.filter(d => d.Country === country).sort((a, b) => a.Year - b.Year);
                this.calculatePercentageChange(countryData, attribute);
                countryData.forEach(d => {
                    d.originalValue = parseFloat(d[attribute]); // Store original value
                });
                processedData.push(...countryData);
                countryData.forEach(d => allYears.add(d.Year));
            });

            allYears = Array.from(allYears).sort((a, b) => a - b); // Convert to sorted array

            // Set dimensions and margins
            const chartContainer = d3.select("#" + chartId).node();
            const containerWidth = chartContainer.getBoundingClientRect().width;
            const containerHeight = chartContainer.getBoundingClientRect().height; // Or set a fixed height

            // Set dimensions and margins
            const margin = {
                top: 20,
                right: 30,
                bottom: 40,
                left: 50
            };
            const width = containerWidth - margin.left - margin.right;
            const height = containerHeight - margin.top - margin.bottom;

            let minPercentChange = d3.min(processedData, d => d.percentChange);
            let maxPercentChange = d3.max(processedData, d => d.percentChange);

            // Adjust the domain to include a buffer or to handle specific edge cases
            minPercentChange = Math.floor(minPercentChange);
            maxPercentChange = Math.ceil(maxPercentChange);

            // Set up scales
            const xScale = d3.scaleLinear()
                .domain(d3.extent(allYears))
                .range([0, width]);

            const yScale = d3.scaleLinear()
                .domain([minPercentChange, maxPercentChange]) // Dynamically set domain based on data
                .range([height, 0]);

            // Define the line
            const line = d3.line()
                .x(d => xScale(d.Year))
                .y(d => yScale(d.percentChange));

            // Append SVG and draw the line for each country
            const svg = d3.select("#" + chartId).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Add the X Axis only once
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(xScale).tickFormat(d3.format("d"))
                    .tickValues(allYears)); // Ensure only unique years are ticked

            // Add the Y Axis
            svg.append("g").call(d3.axisLeft(yScale));

            // Define the Y-axis with horizontal grid lines
            const yAxis = d3.axisLeft(yScale)
                .tickSize(-width) // this will extend the ticks (grid lines) across the width of the chart
                .tickFormat(''); // no text for the grid lines

            // Add the Y Axis with the grid lines
            svg.append("g")
                .attr("class", "grid")
                .call(yAxis);
                
            // Add X-axis label
            svg.append("text")
                .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 5})`)
                .style("text-anchor", "middle")
                .text("Year");

            // Add Y-axis label
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("% Change");

            countries.forEach(country => {
                let countryData = processedData.filter(d => d.Country === country);
                let className = `line-${country.split(' ').join('-')}`; // Convert country name to class name
                let path = svg.append("path") // Define 'path' here
                    .datum(countryData)
                    .attr("class", className)
                    .attr("fill", "none")
                    .attr("stroke", colorScale(country))
                    .attr("stroke-width", 2)
                    .attr("d", line);

                path.on("mouseover", function (event, d) {
                    // Find the closest data point to the mouseover location
                    const [x, y] = d3.pointer(event, this);
                    const xYear = xScale.invert(x);
                    const closestData = d.filter(dataPoint =>
                        Math.abs(dataPoint.Year - xYear) === d3.min(d, dp => Math.abs(dp.Year - xYear))
                    )[0]; // Get the closest year data

                    const tooltip = d3.select("#tooltip");

                    // Calculate the position of the tooltip
                    const tooltipX = event.pageX - 300;
                    const tooltipY = event.pageY - tooltip.node().getBoundingClientRect().height - 10; // Adjust the vertical position

                    tooltip
                        .style("opacity", 1)
                        .html("Country: " + country + "<br/>Year: " + closestData.Year + "<br/>Value: " + closestData.originalValue)
                        .style("left", tooltipX + "px")
                        .style("top", tooltipY + "px");
                });

                path.on("mouseout", function () {
                    d3.select("#tooltip").style("opacity", 0);
                });
            });
        },
    }
};
</script>

<style>
body {
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Arial, sans-serif;
}

h1 {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 24px;
}

#legend-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    margin-left: 30px;
}

#legend-container input[type="checkbox"] {
    cursor: pointer;
}

.charts-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 20px;
}

.chart-container {
    flex-basis: 100%;
    margin: 10px;
    align-items: center;
    border: 1px solid #ccc;
    padding: 10px;
    box-sizing: border-box;
}

.chart {
    width: 100%;
    height: 300px;
}

.tooltip {
    position: absolute;
    text-align: center;
    width: auto;
    height: auto;
    padding: 8px;
    font: 12px sans-serif;
    background: white;
    border: 1px solid #000;
    border-radius: 4px;
    pointer-events: none;
    opacity: 0;
}

.grid line {
    stroke: lightgrey;
    stroke-opacity: 0.7;
    shape-rendering: crispEdges;
    stroke-dasharray: 3, 3;
    /* creates the dotted effect */
}

.grid path {
    stroke-width: 0;
    /* removes the axis line */
}

@media (min-width: 768px) {
    .chart-container {
        flex-basis: calc(50% - 20px);
    }
}
</style>
