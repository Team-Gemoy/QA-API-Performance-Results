/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8831578947368421, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "[PUT] /flight/update"], "isController": false}, {"data": [1.0, 500, 1500, "[DEL] /transaction/delete"], "isController": false}, {"data": [1.0, 500, 1500, "[DEL] /flight/delete"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] /user/update"], "isController": false}, {"data": [1.0, 500, 1500, "[PUT] /airport/update"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] /airport"], "isController": false}, {"data": [0.03, 500, 1500, "[POST] /user-register/register-user"], "isController": false}, {"data": [1.0, 500, 1500, "[DEL] /airport/delete"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] /flight/list"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] /forget-password/forgot-password"], "isController": false}, {"data": [0.0, 500, 1500, "[POST] /user-login/login"], "isController": false}, {"data": [1.0, 500, 1500, "[POST] /airport/save"], "isController": false}, {"data": [0.83, 500, 1500, "[POST] /flight/save"], "isController": false}, {"data": [0.97, 500, 1500, "[GET] /transaction"], "isController": false}, {"data": [0.96, 500, 1500, "[POST] /transaction/save"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] /user/profile"], "isController": false}, {"data": [0.99, 500, 1500, "[POST] /airplane/save"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] /transaction/getById"], "isController": false}, {"data": [1.0, 500, 1500, "[GET] /airport/list"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 950, 0, 0.0, 1031.1200000000017, 46, 24226, 98.0, 1895.099999999998, 6181.949999999998, 21797.25000000001, 4.347746494343353, 14.767365886322448, 2.403819337975506], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["[PUT] /flight/update", 50, 0, 0.0, 96.46000000000004, 54, 309, 76.0, 206.0999999999999, 262.29999999999984, 309.0, 0.23544369364066584, 0.438008043345184, 0.09909788277258494], "isController": false}, {"data": ["[DEL] /transaction/delete", 50, 0, 0.0, 96.5, 59, 169, 85.5, 143.29999999999998, 152.7, 169.0, 0.23605281917881946, 0.8505508661368067, 0.16228631318543837], "isController": false}, {"data": ["[DEL] /flight/delete", 50, 0, 0.0, 89.94000000000001, 46, 437, 70.5, 151.9, 241.94999999999996, 437.0, 0.235444802320544, 0.1791127939528357, 0.055412302108643646], "isController": false}, {"data": ["[PUT] /user/update", 50, 0, 0.0, 105.14, 56, 410, 77.0, 161.19999999999996, 354.0499999999997, 410.0, 0.2364971927783217, 0.3032429825370473, 0.19053728910362833], "isController": false}, {"data": ["[PUT] /airport/update", 50, 0, 0.0, 110.3, 49, 318, 82.5, 246.79999999999995, 271.59999999999997, 318.0, 0.2362468874472579, 0.23347836923498533, 0.19356556500805602], "isController": false}, {"data": ["[GET] /airport", 50, 0, 0.0, 83.39999999999999, 47, 275, 70.5, 117.19999999999999, 214.45, 275.0, 0.23622568056618573, 0.2334574108720507, 0.03852508657671193], "isController": false}, {"data": ["[POST] /user-register/register-user", 50, 0, 0.0, 3674.5999999999995, 989, 7599, 3445.0, 6351.099999999999, 6828.5499999999965, 7599.0, 0.24727869792928817, 0.18980571930900442, 0.09804213999930762], "isController": false}, {"data": ["[DEL] /airport/delete", 50, 0, 0.0, 99.57999999999998, 55, 306, 82.0, 195.09999999999997, 245.39999999999995, 306.0, 0.23619666679263823, 0.18014609059086958, 0.17230362313877026], "isController": false}, {"data": ["[GET] /flight/list", 50, 0, 0.0, 120.08000000000003, 66, 357, 98.0, 212.39999999999998, 276.09999999999974, 357.0, 0.2354281732186327, 1.7436399079004987, 0.07816951063899916], "isController": false}, {"data": ["[POST] /forget-password/forgot-password", 50, 0, 0.0, 84.86000000000001, 53, 436, 71.0, 112.89999999999998, 194.44999999999973, 436.0, 0.23654977953560546, 0.18249445882141438, 0.05705839408720171], "isController": false}, {"data": ["[POST] /user-login/login", 50, 0, 0.0, 13208.02, 3073, 24226, 12829.0, 23601.3, 23998.05, 24226.0, 0.23319155286918888, 0.43359054361614807, 0.06103060172748302], "isController": false}, {"data": ["[POST] /airport/save", 50, 0, 0.0, 97.85999999999996, 53, 389, 75.5, 158.1, 298.1499999999997, 389.0, 0.23630718042998453, 0.23423026185198664, 0.21138415749400963], "isController": false}, {"data": ["[POST] /flight/save", 50, 0, 0.0, 506.34000000000003, 266, 1068, 460.0, 880.9, 1001.6999999999997, 1068.0, 0.23522991371766766, 0.1796384692648595, 0.0983187529991814], "isController": false}, {"data": ["[GET] /transaction", 50, 0, 0.0, 304.7, 155, 665, 270.5, 485.79999999999995, 535.2499999999999, 665.0, 0.23569563208854613, 6.705849162750191, 0.16135023251374106], "isController": false}, {"data": ["[POST] /transaction/save", 50, 0, 0.0, 358.85999999999996, 195, 1435, 323.5, 476.2, 703.1999999999983, 1435.0, 0.235984859211433, 0.8834913620692098, 0.3297796225894147], "isController": false}, {"data": ["[GET] /user/profile", 50, 0, 0.0, 90.94, 56, 267, 73.5, 173.59999999999994, 238.24999999999997, 267.0, 0.23652068609920626, 0.3032731062971267, 0.1552167002526041], "isController": false}, {"data": ["[POST] /airplane/save", 50, 0, 0.0, 244.07999999999998, 136, 1396, 204.0, 355.59999999999997, 432.6999999999999, 1396.0, 0.23521442146660895, 0.2513302845624071, 0.12472795982067253], "isController": false}, {"data": ["[GET] /transaction/getById", 50, 0, 0.0, 123.28000000000002, 62, 281, 95.5, 241.39999999999998, 270.04999999999995, 281.0, 0.23613643018390307, 0.8448564836569977, 0.15750115411680254], "isController": false}, {"data": ["[GET] /airport/list", 50, 0, 0.0, 96.34, 50, 248, 76.5, 218.59999999999997, 242.35, 248.0, 0.2363563308043206, 0.8521753645796403, 0.03877721052258385], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 950, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
