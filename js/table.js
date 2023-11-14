// Create the table
function createTable() {
    // Select the table container
    var tableContainer = d3.select(".table-responsive");

    // Create the table structure
    var table = tableContainer.append("table")
        .attr("class", "table table-striped table-sm display")
        .attr("id", "myDataTable")
        .style("width", "100%");
    var thead = table.append("thead");
    var tbody = table.append("tbody");
    var tfoot = table.append("tfoot");

    // Append table header and footer
    thead.append("tr")
        .selectAll("th")
        .data(["Country", "Year", "Malaria Case Count", "Malaria Death Count", "GDP per Capita"])
        .enter()
        .append("th")
        .text(function (column) { return column; });

    tfoot.append("tr")
        .selectAll("th")
        .data(["Country", "Year", "Malaria Case Count", "Malaria Death Count", "GDP per Capita"])
        .enter()
        .append("th")
        .text(function (column) { return column; });

    // Load data from JSON file
    d3.json("data/tabledata.json").then(function(tableData) {
        // Append table rows with data
        var rows = tbody.selectAll("tr")
            .data(tableData)
            .enter()
            .append("tr");

        // Append data cells within rows
        var cells = rows.selectAll("td")
            .data(function (row) {
                return ["Country", "Year", "Malaria Case Count", "Malaria Death Count", "GDP per Capita"].map(function (column) {
                    return { column: column, value: row[column] };
                });
            })
            .enter()
            .append("td")
            .text(function (d) { return d.value; });

    // Initialize DataTable with filtering and sorting
    $('#myDataTable').DataTable({
      initComplete: function () {
        this.api().columns().every(function () {
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
      "pageLength": 25
    });

    $('#myDataTable tfoot tr').appendTo('#myDataTable thead');

    }).catch(function(error) {
        // Handle errors if the JSON file fails to load
        console.error("Error loading the data: " + error);
    });
}
