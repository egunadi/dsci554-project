<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">

        <div class="col-12">
          <card class="card-plain">
            <template slot="header">
              <h4 class="card-title">Table on Plain Background</h4>
              <p class="card-category">Here is a subtitle for this table</p>
            </template>
            <l-table ref="myTable"
                     class="table-responsive"
                     id="myDataTable"
                     :columns="table1.columns"
                     :data="table1.data">
            </l-table>
          </card>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import LTable from 'src/components/Table.vue'
  import Card from 'src/components/Cards/Card.vue'
  import 'jquery';
  import $ from 'jquery';
  import 'datatables.net/js/jquery.dataTables';
  import tableData from 'src/assets/data/tabledata.json';

  // const tableColumns = ['id', 'country', 'year']
  const tableColumns = ['country', 'year', 'malaria case count', 'malaria death count', 'gdp per capita']

  export default {
    components: {
      LTable,
      Card
    },
    data () {
      return {
        table1: {
          columns: [...tableColumns],
          data: [...tableData]
        },
        table2: {
          columns: [...tableColumns],
          data: [...tableData]
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        $(this.$refs.myTable.$el).DataTable({
          initComplete: function () {
            this.api()
              .columns()
              .every(function () {
                let column = this;
                let title = $(column.header()).text();

                // Create input element
                let input = document.createElement('input');
                $(input).appendTo($(column.footer()).empty())
                   .on('keyup', function () {
                      if (column.search() !== this.value) {
                         column.search(this.value).draw();
                      }
                   });

                  // Set placeholder text
                  $(input).attr('placeholder', 'Search ' + title);
              });
          },
          "pageLength": 25,
          responsive: true, // Enable responsive option
          autoWidth: false // Disable automatic width calculation
        });

        $('#myDataTable tfoot tr').appendTo('#myDataTable thead');
      });
    }
  }
</script>
<style>
tfoot input {
  width: 100%;
  padding: 3px;
  box-sizing: border-box;
}
</style>
