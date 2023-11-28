<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="text-warning" style="display: flex; align-items: left; justify-content: left;">
            </div>
            <div slot="content" style="text-align: left;">
              <p class="card-category">Correlation Coefficient</p>
              <h2 class="card-title">0.90</h2>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>Updated now
            </div>
          </stats-card>
        </div>





      </div>
      <div class="row">
        <div class="col-md-8">
          <chart-card :chart-data="lineChart.data"
                      :chart-options="lineChart.options"
                      :responsive-options="lineChart.responsiveOptions">
            <template slot="header">
              <h4 class="card-title">Malaria Case Count vs GDP Per Capita</h4>
              <p class="card-category">Burkina Faso</p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> Open
                <i class="fa fa-circle text-danger"></i> Click
                <i class="fa fa-circle text-warning"></i> Click Second Time
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div>
            </template>
          </chart-card>
        </div>
      </div>

    </div>
  </div>

</template>
<script>
  import ChartCard from 'src/components/Cards/ChartCard.vue'
  import StatsCard from 'src/components/Cards/StatsCard.vue'

  import scatterData from 'src/assets/data/Burkina Faso_scatterData.json';

  export default {
    components: {
      ChartCard,
      StatsCard
    },
    data () {
      //const sortedData = scatterData.slice().sort((a, b) => a.gdp_per_capita - b.gdp_per_capita);

      return {
        isChartVisible: false,

        lineChart: {
          data: {
            data: scatterData.map(entry => ({
              x: entry.gdp_per_capita,
              y: entry.malaria_case_count}))}
          },
          options: {
            low: scatterData[0].gdp_per_capita,
            high: scatterData[scatterData.length - 1].gdp_per_capita,
            showArea: false,
            height: '245px',
            axisX: {
              showGrid: false
            },
            axisY: {
              low: scatterData[0].malaria_case_count,
              high: scatterData[scatterData.length - 1].malaria_case_count,
              onlyInteger: false},
            showLine: false,
            showPoint: true,
            fullWidth: true,
            chartPadding: {
              right: 50
            }
          },
          
          responsiveOptions: [
            ['screen and (max-width: 300px)', {
              axisX: {
                labelInterpolationFnc (value) {
                  return value[0]
                }
              }
            }]
          ]
        }
    }
  };

</script>
<style>

</style>
