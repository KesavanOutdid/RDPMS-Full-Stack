import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom/cjs/react-router-dom.min';
function PointHmuHistory() {
    //const [deviceName, setDeviceName] = useState(null);
    const [module, setModule] = useState(null);
    const [liveData, setLiveData] = useState([]);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   // console.log(historyData,'history data');
    useEffect(() => {
        // URL data get
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        // Get the 'device_name' and 'module' parameters from the URL
        const deviceNameFromURL = urlParams.get('device_name');
        const moduleFromURL = urlParams.get('module');

        // Update the state with the extracted values
        //  setDeviceName(deviceNameFromURL);
           setModule(moduleFromURL);

        //fetchLiveData
        const url = `http://localhost:9000/fetchLiveData?device_name=${deviceNameFromURL}&module=${moduleFromURL}`;
        // Call the API with the extracted parameters
        axios.get(url).then((res) => {
           // console.log('Data fetched successfully:', res.data);
            setLiveData(res.data.data); 
            setLoading(false);
          })
          .catch((err) => {
            console.error('Error fetching data:', err);
            setError('Error fetching data. Please try again.');
            setLoading(false);
          });
    }, []);

    // fetchHistoryData
    useEffect(() => {
        // URL data get
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        // Get the 'device_name' and 'module' parameters from the URL
        const deviceNameFromURL = urlParams.get('device_name');
        const moduleFromURL = urlParams.get('module');

        const url = `http://localhost:9000/fetchHistoryData?device_name=${deviceNameFromURL}&module=${moduleFromURL}`;
        // Call the API with the extracted parameters
        axios.get(url).then((respons) => {
            setHistoryData(respons.data.data); // Assuming the data you need is inside the 'data' property
            setLoading(false);
          })
          .catch((err) => {
            console.error('Error fetching data:', err);
            setError('Error fetching data. Please try again.');
            setLoading(false);
          });
    }, []);
  return (
    <div className="content-wrapper" id="liveData">
        <section className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6 module-name">
                    <h1>{module}</h1>
                    </div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <Link to="/pointhmu"><button type="button" className="btn btn-info">Back</button></Link>
                        </ol>
                    </div>
                </div>
            </div>
        </section>

        {/* Live content */}
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Live Data's</h3>
                            </div>
                            <div>
                                <div className="card-body table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Device ID</th>
                                                <th>DCVoltage Channels V1</th>
                                                <th>DCVoltage Channels V2</th>
                                                <th>DCVoltage Channels V3</th>
                                                <th>DCCurrent Channels I1</th>
                                                <th>DCCurrent Channels I2</th>
                                                <th>DCCurrent Channels I3</th>
                                                <th>Vibration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: 'center', marginTop: '50px' }}>{error}</td>
                                        </tr>
                                    ) : Array.isArray(liveData) && liveData.length > 0 ? (
                                        
                                        liveData.map((dataItem, index) => (
                                          
                                        <tr key={index}>
                                            <td>{dataItem.VoltageChannels_v2}</td>
                                            <td>{dataItem.VoltageChannels_v2}</td>
                                            <td>{dataItem.VoltageChannels_v3}</td>
                                            <td>{dataItem.VoltageChannels_v2}</td>
                                            <td>{dataItem.currentChannels_i1}</td>
                                            <td>{dataItem.currentChannels_i1}</td>
                                            <td>{dataItem.currentChannels_i1}</td>
                                        </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td colSpan="8" style={{ textAlign: 'center', marginTop: '50px' }}> No device found. </td>
                                          </tr>
                                        )}
                                </tbody>    
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* History content */}
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">History</h3>
                                <div className="card-tools">
                                    <div className="input-group input-group-sm" style={{width:'200px'}} id="graph-btn">
                                        {/* <Link to="/pointhmugraph" className="float-right" style={{marginLeft:'100px', marginTop:'3px'}} id="DEV_001">Graph View</Link> */}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="card-body table-responsive">
                                    <table id="example2" className="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th style={{width:'10px'}}>Sl.no</th>
                                                <th>Device ID</th>
                                                <th>DCVoltage Channels V1</th>
                                                <th>DCVoltage Channels V2</th>
                                                <th>DCVoltage Channels V3</th>
                                                <th>DCCurrent Channels I1</th>
                                                <th>DCCurrent Channels I2</th>
                                                <th>DCCurrent Channels I3</th>
                                                <th>Vibration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="9" style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</td>
                                            </tr>
                                            ) : error ? (
                                                <tr>
                                                    <td colSpan="9" style={{ textAlign: 'center', marginTop: '50px' }}>{error}</td>
                                                </tr>
                                            ) : Array.isArray(historyData) && historyData.length > 0 ? (
                                                
                                                historyData.map((historyDataItem, index) => (
                                                
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{historyDataItem.device_id}</td>
                                                    <td>{historyDataItem.VoltageChannels_v1}</td>
                                                    <td>{historyDataItem.VoltageChannels_v2}</td>
                                                    <td>{historyDataItem.VoltageChannels_v3}</td>
                                                    <td>{historyDataItem.VoltageChannels_v1}</td>
                                                    <td>{historyDataItem.VoltageChannels_v2}</td>
                                                    <td>{historyDataItem.VoltageChannels_v3}</td>
                                                    <td>{historyDataItem.VoltageChannels_v3}</td>
                                                </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="9" style={{ textAlign: 'center', marginTop: '50px' }}>No device found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
};

export default PointHmuHistory
