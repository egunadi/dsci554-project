<template>
<div>
    <div id="legend-container" class="row">
        <!-- Add 'row' class here -->
        <!-- Legend items will be dynamically inserted here -->
    </div>
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

        // Add a resize event listener
        this.resizeEventHandler = () => this.updateChartSizes();
        window.addEventListener('resize', this.resizeEventHandler);
    },
    beforeDestroy() {
        // Remove the resize event listener
        window.removeEventListener('resize', this.resizeEventHandler);
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
        updateChartSizes() {
            // Method to update chart sizes
            this.drawLineChart(tableData, "Population", "population-chart");
            this.drawLineChart(tableData, "No. of cases", "cases-chart");
            this.drawLineChart(tableData, "GDP_per_capita", "gdp-chart");
            this.drawLineChart(tableData, "No. of deaths", "deaths-chart");
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

            countries.forEach((country) => {
                const legendItem = legendContainer.append("div")
                    .attr("class", "legend-item d-inline-flex align-items-center")
                    .style("margin-left", "10px")
                    .style("margin-right", "10px"); // Inline-flex for content-based sizing

                // Colored rectangle for the legend
                legendItem.append("svg")
                    .attr("width", 20)
                    .attr("height", 20)
                    .append("rect")
                    .attr("width", 15)
                    .attr("height", 15)
                    .attr("fill", colorScale(country))
                    .attr("y", 2.5);

                const className = `line-${country.split(' ').join('-')}`;
                // Checkbox input
                legendItem.append("input")
                    .attr("type", "checkbox")
                    .attr("id", `checkbox-${className}`)
                    .attr("checked", true);

                // Checkbox label
                legendItem.append("label")
                    .attr("for", `checkbox-${className}`)
                    .text(country)
                    .style("margin-left", "5px")
                    .style("margin-bottom", "0px");

                // Checkbox event
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
            
            d3.select(`#${chartId} svg`).remove();
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
                .style("stroke-dasharray", "3,3")
                .style("stroke-width", "0.5px")
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

<style scoped>
body {
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Arial, sans-serif;
}

#legend-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    margin-bottom: 20px;
}
.legend-item {
    display: flex;
    align-items: center; /* Align items vertically in the center */
    margin: 5px;
    padding: 5px;
    background: #f8f9fa;
    border-radius: 4px;
}

.legend-item svg {
    display: block; /* Ensure SVG aligns correctly */
}

.legend-item input[type="checkbox"] {
    cursor: pointer;
    margin-right: 5px; /* Add some space between checkbox and label */
}

.legend-item label {
    margin: 0; /* Remove default margin */
    line-height: 1; /* Adjust line height to match checkbox height */
}

.charts-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    /* Larger size for wider screens */
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}

.chart-container {
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

/* Media query for mobile screens */
@media (max-width: 767px) {
    .charts-container {
        grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
        /* Full width on smaller screens */
    }

    .legend-item {
        flex-basis: calc(50% - 10px);
        /* 2 columns for mobile */
    }
}

/* Media query for iPad screens */
@media (min-width: 768px) and (max-width: 1024px) {
    .legend-item {
        flex-basis: calc(20% - 10px);
        /* 5 columns for iPads */
    }
}

/* Media query for larger screens */
@media (min-width: 1025px) {
    .legend-item {
        flex-basis: calc(10% - 10px);
        /* 10 columns for larger screens */
    }
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
}

.grid path {
    stroke-width: 0;
}
</style>
