const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const net = require('net');
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
        //console.log(fetchLiveData, 'live data ok');
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

// Create a TCP server
const server = net.createServer((socket) => {
    console.log('Client connected');

    socket.on('data', async(data) => {
        const message = data.toString(); // Convert the Buffer to a string
        console.log(`Received data: ${message}`);
        await ReceivedMessage(message);
        // Emit the message to all connected Socket.io clients
        io.emit('tcpMessage', message);

        socket.write('acknowledged\r\n');
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });

    socket.on('error', (err) => {
        console.error(`Socket error: ${err.message}`);
    });
});

async function ReceivedMessage(message) {
    try {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.DEVID.includes('SHMU')) {
            try {
                const DB_FRAME = {
                    DEVID: parsedMessage.DEVID,
                    V1: parsedMessage.VC.v1,
                    V2: parsedMessage.VC.v2,
                    V3: parsedMessage.VC.v3,
                    V4: parsedMessage.VC.v4,
                    I1: parsedMessage.CC.i1,
                    I2: parsedMessage.CC.i2,
                    I3: parsedMessage.CC.i3,
                    I4: parsedMessage.CC.i4,
                    Status: parsedMessage.SIGSTATUS.status
                };
                const saveSignalHmu = await SaveSignalHmu(DB_FRAME); // save signal hmu data into db
                console.log(saveSignalHmu);
            } catch (error) {
                console.error('Error inserting SignalHmu data:', error);
            }
        }else if(parsedMessage.DEVID.includes('PHMU')){
            try {
                const DB_FRAME = {
                    DEVID: parsedMessage.DEVID,
                    V1: parsedMessage.VC.v1,
                    V2: parsedMessage.VC.v2,
                    V3: parsedMessage.VC.v3,
                    V4: parsedMessage.VC.v4,
                    I1: parsedMessage.CC.i1,
                    I2: parsedMessage.CC.i2,
                    I3: parsedMessage.CC.i3,
                    I4: parsedMessage.CC.i4,
                    Status: parsedMessage.SIGSTATUS.status
                };
                const savePointHmu = await SavePointHmu(DB_FRAME); // save point hmu data into db
                console.log(savePointHmu);
            } catch (error) {
                console.error('Error inserting PointHmu data:', error);
            }
        }
    } catch (error) {
        console.error('Error parsing or inserting data:', error);
    }
}

const tcpPort = 9090;
server.listen(tcpPort, () => {
    console.log(`TCP Server listening on:${tcpPort}`);
});

// Set up Socket.io to work with the Express server
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const httpPort = 9000;
http.listen(httpPort, () => {
    console.log(`Express server listening on port ${httpPort}`);
});