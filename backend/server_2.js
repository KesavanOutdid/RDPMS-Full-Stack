const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
//const port = 9000;
const cluster = require('cluster');
const os = require('os');
const net = require('net');
const JSONStream = require('JSONStream');
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

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    // Create a master process that forks worker processes
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    const app = express();
    const PORT_HTTP = process.env.PORT || 9000;
    const PORT_TCP = 9000;
    const HOST_TCP = '192.168.1.16';

   // app.use(express.static('./public', { index: 'signal_hmu.html' }));

    app.listen(PORT_HTTP, () => {
        console.log(`HTTP Worker ${process.pid} listening on port ${PORT_HTTP}`);
    });

    //Create a TCP server to handle incoming TCP requests
    const tcpServer = net.createServer((socket) => {
        socket.write('acknowledged\r\n');

        // Create a JSONStream parser
        const parser = JSONStream.parse(/\}\s*\{/);
        socket.pipe(parser);

        parser.on('data', (jsonData) => {
            processDataAndSave(jsonData);
        });

        parser.on('error', (err) => {
            console.error('Error parsing JSON data:', err);
        });

        // Handle socket errors, including ECONNRESET
        socket.on('error', (err) => {
            if (err.code === 'ECONNRESET') {
                console.error('Connection was reset by the client.');
                // You can add custom handling for this error as needed.
            } else {
                console.error('Socket error:', err);
            }
        });

    });

    tcpServer.listen(PORT_TCP, HOST_TCP, () => {
        console.log(`TCP Worker ${process.pid} listening on ${HOST_TCP}:${PORT_TCP}`);
    });

    // Process and Save the received data
    async function processDataAndSave(tcp_val) {
        if (isValidDataStructure(tcp_val)) {

            const currentDateTime = new Date().toLocaleString();
            console.log(`Last data received from on: ${currentDateTime}`);
            console.log('Board:', tcp_val.communication_board.deviceId);

            if (tcp_val.communication_board.SignalHmu) {
                try {
                    const saveSignalHmu = await SaveSignalHmu(tcp_val.communication_board.SignalHmu); // save signal hmu data into db
                    console.log(saveSignalHmu);
                } catch (error) {
                    console.error('Error inserting SignalHmu data:', error);
                }
            } else {
                console.error('SignalHmu data is missing or incorrect');
            }

            if (tcp_val.communication_board.PointHmu) {
                try {
                    const savePointHmu = await SavePointHmu(tcp_val.communication_board.PointHmu); // save point hmu data into db
                    console.log(savePointHmu);
                } catch (error) {
                    console.error('Error inserting PointHmu data:', error);
                }
            } else {
                console.error('PointHmu data is missing or incorrect');
            }

            if (tcp_val.communication_board.TrackHmu) {
                try {
                    const saveTrackHmu = await SaveTrackHmu(tcp_val.communication_board.TrackHmu); // save track hmu data into db
                    console.log(saveTrackHmu);
                } catch (error) {
                    console.error('Error inserting TrackHmu data:', error);
                }
            } else {
                console.error('TrackHmu data is missing or incorrect');
            }
        }
    }

    function isValidDataStructure(tcp_val) {
        return (
            tcp_val &&
            tcp_val.communication_board &&
            tcp_val.communication_board.deviceId
        );
    }
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
                    //console.log(fetchAlldata, "All data fetched");
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


    //app.listen(port, () => {
    //    console.log(`Server is running on port ${port}`);
    //  });
}