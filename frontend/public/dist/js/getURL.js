$(document).ready(function() {
    // URL data get
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const device_name = urlParams.get('device_id');
    const module = urlParams.get('module');

    Historydata(device_name, module);
    Livedata(device_name, module);

    // Create an interval to call Historydata and Livedata functions
    const historydataInterval = setInterval(function() {
        Historydata(device_name, module);
    }, 1000); // Call Historydata every 5 seconds

    const livedataInterval = setInterval(function() {
        Livedata(device_name, module);
    }, 1000); // Call Livedata every 10 seconds

    // Cancel intervals when the page is about to be closed
    $(window).on('beforeunload', function() {
        clearInterval(historydataInterval);
        clearInterval(livedataInterval);
    });
});