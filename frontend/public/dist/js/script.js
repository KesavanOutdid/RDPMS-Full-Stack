let Value; // Define a variable outside the event listener

// Add an event listener to listen for the 'reloadPage' event
window.addEventListener('reloadPage', (event) => {
    Value = event.detail; // Assign the value to the variable
    FetchDevices(Value); // Call a function with 'Value'
    showTotal(Value);
});

const buttons = document.getElementsByClassName("sub-gears");

const buttonPressed = e => {
    $(".srchFld").val("");
    FetchDevices(e.target.id);
    showTotal(e.target.id);
    $("#main-dashboard").show();
}

for (let button of buttons) {
    button.addEventListener("click", buttonPressed);
}

document.addEventListener("DOMContentLoaded", function() {
    var header = document.getElementById("gears");
    var btns = header.getElementsByClassName("sub-gears");
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
            var current = header.getElementsByClassName("sub-gears active");
            for (var j = 0; j < current.length; j++) {
                current[j].classList.remove("active");
            }
            this.classList.add("active");
        });
    }
});

$(document).on('keyup', '.srchFld', function() {
    var search = $(this).val();
    var Value = $(".dash-head").attr('id');
    if (search !== '') {
        FetchDevices(Value, search);
    } else {
        FetchDevices(Value);
    }
});


// Dashboard get devices data
function FetchDevices(Value, search) {
   // alert(Value + ' Value recevied');
    $("#mod").empty();
    $(".dash-head").empty();
    $("#device-data").empty();

    $(".dash-head").append(Value);
    $("#mod").append('<li class="breadcrumb-item">Dashboard</li><li class="breadcrumb-item active dash-head" id="' + Value + '">' + Value + '</li>');

    $.ajax({

        type: "GET",
        data: {
            module: Value,
            search: search
        },
        url: "/FetchDevices",
        success: function(response) {

            var len = response.data.length;

            var slno = 1;
            var act_count = 0;
            var inact_count = 0;

            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var device_id = response.data[i].device_id;
                    var date = response.data[i].created_date;
                    var status = response.data[i].status;
 
                    switch (Value || search) {
                        case "Signal HMU":
                            var url = "/signalhmuhistory";
                            break;
                        case "Point HMU":
                            var url = "/pointhmuhistory";
                            break;
                        case "Track HMU":
                            var url = "/trackhmuhistory";
                            break;
                    }

                    $("#device-data").append('<tr>' +
                        '<td>' + slno + '</td>' +
                        '<td>' + device_id + '</td>' +
                        '<td>' + date + '</td>' +
                        (status == 1 ? '<td><span class="badge bg-success">Active</span></td>' : '<td><span class="badge bg-danger">Inactive</span></td>') +
                        '<td><a href="' + url + '?device_id=' + device_id + '&module=' + Value + '"><button type="button" class="btn btn-block btn-primary">View</button></a></td>' +
                        '</tr>');

                    slno++;

                    if (status == 1) {
                        act_count++;
                    } else {
                        inact_count++;
                    }
                }

            } else {
                $("#device-data").append('<td colspan="5" style="text-align:center;padding-top:50px;">No device found</td>');
            }
        },
        error: function(response) {
            console.error("Error occur while fetching devices", response);
        }
    })
}

// Dashboard get total count
function showTotal(Value) {

    $("#total-devices").empty();
    $("#active-devices").empty();
    $("#inactive-devices").empty();

    $.ajax({
        type: "GET",
        data: {
            module: Value
        },
        url: "/FetchDevices",
        success: function(response) {

            var len = response.data.length;
            var act_count = 0;
            var inact_count = 0;

            if (len > 0) {
                for (var i = 0; i < len; i++) {

                    var status = response.data[i]['status'];

                    if (status == 1) {
                        act_count++;
                    } else {
                        inact_count++;
                    }
                }

                $("#total-devices").append('<h3>' + len + '</h3>');
                $("#active-devices").append('<h3>' + act_count + '</h3>');
                $("#inactive-devices").append('<h3>' + inact_count + '</h3>');

            } else {
                $("#total-devices").append('<h3>0</h3>');
                $("#active-devices").append('<h3>0</h3>');
                $("#inactive-devices").append('<h3>0</h3>');
            }


        },
        error: function(response) {
            console.error("Error occur while fetching count", response);
        }
    })
}

// View inactive box data
$(document).on('click', '#view-inactive', function() {
    var val = 0;
    var module = $(".dash-head").attr('id');
    widgetVal(module, val);
});

// View active box data
$(document).on('click', '#view-active', function() {
    var val = 1;
    var module = $(".dash-head").attr('id');
    widgetVal(module, val);
})

// View all box data
$(document).on('click', '#view-all', function() {
    var module = $(".dash-head").attr('id');
    FetchDevices(module);
})

//Get active & inactive data
function widgetVal(module, val) {
    
    $.ajax({
        type: "GET",
        data: {
            module: module,
            widget_status: val
        },
        url: "/FetchDevices",
        success: function(response) {

            var len = response.data.length;
            var slno = 1;

            $("#device-data").empty();

            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var device_id = response.data[i]['device_id'];
                    var created_date = response.data[i]['created_date'];
                    var status = response.data[i]['status'];

                    switch (module) {
                        case "Signal HMU":
                            var url = "/signalhmuhistory";
                            break;
                        case "Point HMU":
                            var url = "/pointhmuhistory";
                            break;
                        case "Track HMU":
                            var url = "/trackhmuhistory";
                            break;
                    }

                    $("#device-data").append('<tr>' +
                        '<td>' + slno + '</td>' +
                        '<td>' + device_id + '</td>' +
                        '<td>' + created_date + '</td>' +
                        (status == 1 ? '<td><span class="badge bg-success">Active</span></td>' : '<td><span class="badge bg-danger">Inactive</span></td>') +
                        '<td><a href="' + url + '?device_id=' + device_id + '&module=' + module + '"><button type="button" class="btn btn-block btn-primary">View</button></a></td>' +
                        '</tr>');

                    slno++;
                }

            } else {

                $("#device-data").append('<td colspan="5" style="text-align:center;padding-top:50px;">No device found</td>');
            }


        },
        error: function(response) {
            error("Error occur while fetching value", response);
        }
    })
}

// Darkode button data
$(document).on('click', '#darkmode-btn', function() {
//$('#darkmode-btn').click(function() {
    $('#sidebar-dark').toggleClass('main-sidebar elevation-4 sidebar-light-info');
    $('#sidebar-dark').toggleClass('main-sidebar sidebar-dark-primary elevation-4');

    $('#headbar-dark').toggleClass('main-header navbar navbar-expand navbar-white navbar-light');
    $('#headbar-dark').toggleClass('main-header navbar navbar-expand navbar-dark');

    $('#body-dark').toggleClass('sidebar-mini layout-navbar-fixed layout-fixed');
    $('#body-dark').toggleClass('sidebar-mini layout-fixed layout-navbar-fixed dark-mode');
});

//Get history data
function Historydata(device_name, module) {

    switch (module) {
        case "Signal HMU":
            var url = "#";
            break;
        case "Point HMU":
            var url = "#";
            break;
        case "Track HMU":
            var url = "#";
            break;
    }

    $(".module-name").html('<h1>' + module + '</h1>');
    $("#graph-btn").html('<a href="' + url + '?device_id=' + device_name + '&module=' + module + '" class="float-right" style="margin-left: 100px;margin-top: 3px;">Graph View</a>');

    $.ajax({
        type: "GET",
        data: {
            device_name: device_name,
            module: module
        },
        url: "/fetchHistoryData",
        success: function(response) {

            var slno = 1;

            var len = response.data.length;
            $("#history-data").empty();

            switch (module) {
                case "Signal HMU":

                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            var rowData = response.data[i].data;
                            $("#history-data").append('<tr>' +
                                '<td>' + slno + '</td>' +
                                '<td>' + rowData.deviceId + '</td>' +
                                '<td>' + rowData.VoltageChannels.v1 + '</td>' +
                                '<td>' + rowData.VoltageChannels.v2 + '</td>' +
                                '<td>' + rowData.VoltageChannels.v3 + '</td>' +
                                '<td>' + rowData.currentChannels.i1 + '</td>' +
                                '<td>' + rowData.currentChannels.i2 + '</td>' +
                                '<td>' + rowData.currentChannels.i3 + '</td>' +
                                '<td>' + rowData.localsignalstatus.status + '</td>' +
                                '</tr>');
                            slno++;
                        }
                    } else {
                        $("#history-data").append('<td colspan="9" style="text-align:center;padding-top:50px;">No devices found</td>');
                    }

                    break;
                case "Point HMU":

                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            var rowData = response.data[i].data;

                            $("#history-data").append('<tr>' +
                                '<td>' + slno + '</td>' +
                                '<td>' + rowData.deviceId + '</td>' +
                                '<td>' + rowData.DCVoltageChannels.v1 + '</td>' +
                                '<td>' + rowData.DCVoltageChannels.v2 + '</td>' +
                                '<td>' + rowData.DCVoltageChannels.v3 + '</td>' +
                                '<td>' + rowData.DCCurrentChannels.i1 + '</td>' +
                                '<td>' + rowData.DCCurrentChannels.i2 + '</td>' +
                                '<td>' + rowData.DCCurrentChannels.i3 + '</td>' +
                                '<td>' + rowData.Vibration + '</td>' +
                                '</tr>');
                            slno++;
                        }
                    } else {
                        $("#history-data").append('<td colspan="9" style="text-align:center;padding-top:50px;">No device found</td>');
                    }
                    break;
                case "Track HMU":

                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            var rowData = response.data[i].data;

                            $("#history-data").append('<tr>' +
                                '<td>' + slno + '</td>' +
                                '<td>' + rowData.deviceId + '</td>' +
                                '<td>' + rowData.DCfeedendVoltage + '</td>' +
                                '<td>' + rowData.DCrelayendVoltage + '</td>' +
                                '<td>' + rowData.DCfeedendCurrent + '</td>' +
                                '<td>' + rowData.DCrelayendCurrent + '</td>' +
                                '<td>' + rowData.InputVoltageofBatteryCharger + '</td>' +
                                '<td>' + rowData.outputcurrentofBatteryCharger + '</td>' +
                                '<td>' + rowData.ChargingVoltage + '</td>' +
                                '<td>' + rowData.DischargingVoltage + '</td>' +
                                '<td>' + rowData.ChargingCurrent + '</td>' +
                                '<td>' + rowData.DischargingCurrent + '</td>' +
                                '<td>' + rowData.IncomingTPRVoltage + '</td>' +
                                '<td>' + rowData.OutgoingTPRVoltage + '</td>' +
                                '</tr>');
                            slno++;
                        }
                    } else {
                        $("#history-data").append('<td colspan="14" style="text-align:center;padding-top:50px;">No device found</td>');
                    }
                    break;
            }
        },
        error: function(response) {
            console.error("Error occur while fetching history data's", response);
        }
    })
}

// Get live data
// function Livedata(device_name, module) {
      
//     $.ajax({
//         type: "GET",
//         data: {
//             device_name: device_name,
//             module: module
//         },
//         url: "/fetchLiveData",
//         success: function(response) {
//             $("#live-data").empty();
//             switch (module) {
//                 case "Signal HMU":
//                     var len = response.data.data.deviceId.length;

//                     if (len > 0) {
//                         $("#live-data").append('<tr>' +
//                             '<td>' + response.data.data.deviceId + '</td>' +
//                             '<td>' + response.data.data.VoltageChannels.v1 + '</td>' +
//                             '<td>' + response.data.data.VoltageChannels.v2 + '</td>' +
//                             '<td>' + response.data.data.VoltageChannels.v3 + '</td>' +
//                             '<td>' + response.data.data.currentChannels.i1 + '</td>' +
//                             '<td>' + response.data.data.currentChannels.i2 + '</td>' +
//                             '<td>' + response.data.data.currentChannels.i3 + '</td>' +
//                             '<td>' + response.data.data.localsignalstatus.status + '</td>' +
//                             '</tr>');
//                     } else {
//                         $("#live-data").append('<td colspan="8" style="text-align:center;padding-top:50px;">No device found</td>');
//                     }
//                     break;
//                 case "Point HMU":
//                     var len = response.data.data.deviceId.length;

//                     if (len > 0) {
//                         $("#live-data").append('<tr>' +
//                             '<td>' + response.data.data.deviceId + '</td>' +
//                             '<td>' + response.data.data.DCVoltageChannels.v1 + '</td>' +
//                             '<td>' + response.data.data.DCVoltageChannels.v2 + '</td>' +
//                             '<td>' + response.data.data.DCVoltageChannels.v3 + '</td>' +
//                             '<td>' + response.data.data.DCCurrentChannels.i1 + '</td>' +
//                             '<td>' + response.data.data.DCCurrentChannels.i2 + '</td>' +
//                             '<td>' + response.data.data.DCCurrentChannels.i3 + '</td>' +
//                             '<td>' + response.data.data.Vibration + '</td>' +
//                             '</tr>');
//                     } else {
//                         $("#live-data").append('<td colspan="8" style="text-align:center;padding-top:50px;">No device found</td>');
//                     }
//                     break;
//                 case "Track HMU":
//                     var len = response.data.data.deviceId.length;

//                     if (len > 0) {
//                         $("#live-data").append('<tr>' +
//                             '<td>' + response.data.data.deviceId + '</td>' +
//                             '<td>' + response.data.data.DCfeedendVoltage + '</td>' +
//                             '<td>' + response.data.data.DCrelayendVoltage + '</td>' +
//                             '<td>' + response.data.data.DCfeedendCurrent + '</td>' +
//                             '<td>' + response.data.data.DCrelayendCurrent + '</td>' +
//                             '<td>' + response.data.data.InputVoltageofBatteryCharger + '</td>' +
//                             '<td>' + response.data.data.outputcurrentofBatteryCharger + '</td>' +
//                             '<td>' + response.data.data.ChargingVoltage + '</td>' +
//                             '<td>' + response.data.data.DischargingVoltage + '</td>' +
//                             '<td>' + response.data.data.ChargingCurrent + '</td>' +
//                             '<td>' + response.data.data.DischargingCurrent + '</td>' +
//                             '<td>' + response.data.data.IncomingTPRVoltage + '</td>' +
//                             '<td>' + response.data.data.OutgoingTPRVoltage + '</td>' +
//                             '</tr>');
//                     } else {
//                         $("#live-data").append('<td colspan="13" style="text-align:center;padding-top:50px;">No device found</td>');
//                     }
//                     break;
//             }

//         },
//         error: function(response) {
//             console.error("Error occur while fetching live data's", response);
//         }
//     })
// }



