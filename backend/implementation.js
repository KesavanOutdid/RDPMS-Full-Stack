const { client, db } = require('./database.js');

client.connect();

// save signal hmu data into database
async function SaveSignalHmu(data) {
    return new Promise(async(resolve, reject) => {
        try {
            const collection = db.collection('signal_hmu');

            const result = await collection.insertOne({ data });

            if (result.acknowledged === true) {
                resolve('SignalData inserted successfully');
            } else {
                reject(new Error('SignalData not inserted.'));
                console.log(error);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

// save point hmu data into database
async function SavePointHmu(data) {
    return new Promise(async(resolve, reject) => {
        try {
            const collection = db.collection('point_hmu');

            const result = await collection.insertOne({ data });

            if (result.acknowledged === true) {
                resolve('PointData inserted successfully');
            } else {
                reject(new Error('PointData not inserted.'));
                console.log(error);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

// save track hmu data into database
async function SaveTrackHmu(data) {
    return new Promise(async(resolve, reject) => {
        try {
            const collection = db.collection('track_hmu');

            const result = await collection.insertOne({ data });

            if (result.acknowledged === true) {
                resolve('TrackData inserted successfully');
            } else {
                reject(new Error('TrackData not inserted.'));
                console.log(error);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

// fetch all devices based on module request
async function fetchModuleDevices(module) {
    return new Promise(async(resolve, reject) => {
        try {
            var collection = db.collection('module_devices');
            const result = await collection.find({ module_name: module }).toArray();
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

// fetch devices based on widgets value/request
async function widgetDevices(module, widget_status) {
    return new Promise(async(resolve, reject) => {
        try {
            const collection = db.collection('module_devices');
            const query = {
                module_name: module,
                status: widget_status
            };
            const result = await collection.find(query).toArray();
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

// fetch searched devices 
async function searchDevices(search, module) {
    return new Promise(async(resolve, reject) => {
        try {
            const pipeline = [{
                $match: {
                    module_name: module,
                    $or: [
                        { device_id: { $regex: search } },
                        { created_date: { $regex: search } }
                    ]
                }
            }];
            const collection = db.collection('module_devices');
            const result = await collection.aggregate(pipeline).toArray();
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

// fetch latest data based on module request
async function fetchCurrentData(device_name, module) {
    return new Promise(async(resolve, reject) => {
        try {
            let collection;
            switch (module) {
                case "Signal HMU":
                    collection = db.collection('signal_hmu');
                    break;
                case "Point HMU":
                    collection = db.collection('point_hmu');
                    break;
                case "Track HMU":
                    collection = db.collection('track_hmu');
                    break;
                default:
                    reject("Invalid module name");
                    return;
            }

            const result = await collection.findOne({ 'data.DEVID': device_name }, { sort: { _id: -1 } });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

// fetch history of data based on module request
async function fetchHistoryData(device_name, module) {
    return new Promise(async(resolve, reject) => {
        try {
            let collection;
            switch (module) {
                case "Signal HMU":
                    collection = db.collection('signal_hmu');
                    break;
                case "Point HMU":
                    collection = db.collection('point_hmu');
                    break;
                case "Track HMU":
                    collection = db.collection('track_hmu');
                    break;
                default:
                    reject("Invalid module name");
                    return;
            }
            const result = await collection.find({ device_id: device_name }).sort({ _id: -1 }).limit(10).toArray();
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


module.exports = {
    SaveSignalHmu,
    SavePointHmu,
    SaveTrackHmu,
    fetchModuleDevices,
    widgetDevices,
    searchDevices,
    fetchCurrentData,
    fetchHistoryData
};