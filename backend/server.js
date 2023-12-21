const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const port = 9000;
const {
    SaveSignalHmu,
    SavePointHmu,
    SaveTrackHmu,
    fetchModuleDevices,
    widgetDevices,
    searchDevices,
    fetchCurrentData,
    fetchHistoryData
} = require('./implementation');

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

    // List of devices of the module, it will handle search request and widget request too
    app.get('/FetchDevices', async(request, response) => {

        var module = request.query.module;
        var search = request.query.search;
        var widget_status = request.query.widget_status;
       // console.log('Received data ok: ' +  module);
        if (typeof search !== 'undefined') {

            try {
                const searchdata = await searchDevices(search, module);
                response.status(200).json({
                    data: searchdata
                });
            } catch (error) {
                const errorMessage = 'An error occurred during fetch single data';
                response.status(500).json({ error: errorMessage });
            }

        } else {
            if (typeof widget_status !== 'undefined') {
                try {
                    const widgetdata = await widgetDevices(module, Number(widget_status));
                    response.status(200).json({
                        data: widgetdata
                    });
                } catch (error) {
                    const errorMessage = 'An error occurred during fetch all data';
                    response.status(500).json({ error: errorMessage });
                }
            } else {

                try {
                    const fetchAlldata = await fetchModuleDevices(module);
                    response.status(200).json({
                        data: fetchAlldata
                        
                    });
                  //  console.log(fetchAlldata, "All data fetched");
                } catch (error) {
                    const errorMessage = 'An error occurred during fetch all data';
                    response.status(500).json({ error: errorMessage });
                }
            }
        }
    });

    // Live data of the module
    app.get('/fetchLiveData', async(request, response) => {
        var device_name = request.query.device_name;
        var module = request.query.module;

        try {
            const fetchLiveData = await fetchCurrentData(device_name, module);
           // console.log(fetchLiveData, 'live data ok');
            response.status(200).json({
                data: fetchLiveData
            });
        } catch (error) {
            const errorMessage = 'An error occurred during fetch live data';
            response.status(500).json({ error: errorMessage });
        }
    });

    // History data of the module
    app.get('/fetchHistoryData', async(request, response) => {
        var device_name = request.query.device_name;
        var module = request.query.module;

        try {
            const fetchHistorydata = await fetchHistoryData(device_name, module);
           // console.log(fetchHistorydata, 'history data');
            response.status(200).json({
                data: fetchHistorydata
            });
        } catch (error) {
            const errorMessage = 'An error occurred during fetch history data';
            response.status(500).json({ error: errorMessage });
        }
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
      