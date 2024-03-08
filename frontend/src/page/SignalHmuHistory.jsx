import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
function SignalHmuHistory() {
    //const [deviceName, setDeviceName] = useState(null);
    const [module, setModule] = useState(null);
    const [liveData, setLiveData] = useState([]);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [history, setHistory] = useState([]);
    // console.log(historyData,'history data');
    const location = useLocation();
    const { device_name, modules } = location.state;

    useEffect(() => {
        // URL data get
        // const queryString = window.location.search;
        // const urlParams = new URLSearchParams(queryString);

        // Get the 'device_name' and 'module' parameters from the URL
        const deviceNameFromURL = device_name;
        const moduleFromURL = modules;

        // Update the state with the extracted values
        //  setDeviceName(deviceNameFromURL);
           setModule(moduleFromURL);
           const socket = io();

           // Listen for the 'tcpMessage' event
           socket.on('tcpMessage', (message) => {
            try {
                const parsedMessage = JSON.parse(message);
                if (parsedMessage.DEVID === deviceNameFromURL) {
                    console.log('Received message from TCP server:', parsedMessage);
                    setLiveData([parsedMessage]);
                    // setHistory((history) => [
                    //     ...history,
                    //     {
                    //         DEVID: parsedMessage.DEVID

                    //     }
                    // ]);
                    
                    // setHistoryData([parsedMessage]);
                    setHistoryData((prevHistoryData) => [parsedMessage,...prevHistoryData]);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                setError('Error fetching data. Please try again.');
                setLoading(false);
            }
        });
        
        //fetchLiveData
        // /const url = `http://localhost:9000/fetchLiveData?device_name=${deviceNameFromURL}&module=${moduleFromURL}`;
        // Call the API with the extracted parameters
        // axios.get(url).then((res) => {
        //    // console.log('Data fetched successfully:', res.data);
        //     setLiveData(res.data.data); 
        //     setLoading(false);
        //   })
        //   .catch((err) => {
        //     console.error('Error fetching data:', err);
        //     setError('Error fetching data. Please try again.');
        //     setLoading(false);
        //   });
    }, []);
      
    // fetchHistoryData
    // useEffect(() => {
    //     // URL data get
    //     const queryString = window.location.search;
    //     const urlParams = new URLSearchParams(queryString);

    //     // Get the 'device_name' and 'module' parameters from the URL
    //     const deviceNameFromURL = urlParams.get('device_name');
    //     const moduleFromURL = urlParams.get('module');

    //     const url = `http://localhost:9000/fetchHistoryData?device_name=${deviceNameFromURL}&module=${moduleFromURL}`;
    //     // Call the API with the extracted parameters
    //     axios.get(url).then((respons) => {
    //         setHistoryData(respons.data.data); // Assuming the data you need is inside the 'data' property
    //         setLoading(false);
    //       })
    //       .catch((err) => {
    //         console.error('Error fetching data:', err);
    //         setError('Error fetching data. Please try again.');
    //         setLoading(false);
    //       });
    // }, []);

  return (
    <div className="content-wrapper"  id="liveData">
        <section className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6 module-name">
                        <h1>{module}</h1>
                    </div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <Link to="/"><button type="button" className="btn btn-info">Back</button></Link>
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
                                    <th style={{ textAlign: 'center' }}>Device ID</th>
                                    <th colSpan="4" style={{ textAlign: 'center' }}>Voltage Channels</th>
                                    <th colSpan="4" style={{ textAlign: 'center' }}>Current Channels</th>
                                    <th style={{ textAlign: 'center' }}>Status</th>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th>V1</th>
                                    <th>V2</th>
                                    <th>V3</th>
                                    <th>V4</th>
                                    <th>I1</th>
                                    <th>I2</th>
                                    <th>I3</th>
                                    <th>I4</th>
                                    <th></th>
                                </tr>
                            </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="10" style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan="10" style={{ textAlign: 'center', marginTop: '50px' }}>{error}</td>
                                        </tr>
                                    ) : Array.isArray(liveData) && liveData.length > 0 ? (
                                        
                                        liveData.map((dataItem, index) => (
                                          
                                        <tr key={index}>
                                            <td>{dataItem.DEVID}</td>
                                            <td>{dataItem.VC.v1}</td>
                                            <td>{dataItem.VC.v2}</td>
                                            <td>{dataItem.VC.v3}</td>
                                            <td>{dataItem.VC.v4}</td>
                                            <td>{dataItem.CC.i1/1000}</td>
                                            <td>{dataItem.CC.i2/1000}</td>
                                            <td>{dataItem.CC.i3/1000}</td>
                                            <td>{dataItem.CC.i4/1000}</td>
                                            {dataItem.SIGSTATUS.status === 'OK' ? <td><span className="badge bg-success">Active</span></td> : <td><span className="badge bg-danger">Inactive</span></td>}
                                        </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td colSpan="10" style={{ textAlign: 'center', marginTop: '50px' }}> No device found. </td>
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

        {/* History content  */}
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">History Data's</h3>
                                <div className="card-tools">
                                    <div className="input-group input-group-sm" style={{width:'200px'}} id="graph-btn">
                                        {/* <Link to="/signalhmugraph" className="float-right" style={{marginLeft:'100px', marginTop:'3px' }} id="DEV_001">Graph View</Link> */}
                                    </div>
                                </div>
                            </div>
                        <div>
                        <div className="card-body table-responsive" style={{maxHeight:"350px",overflowY:"auto"}}>
                            <table id="example2" className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: '10px' }}>Sl.no</th>
                                    <th style={{ textAlign: 'center' }}>Device ID</th>
                                    <th colSpan="4" style={{ textAlign: 'center' }}>Voltage Channels</th>
                                    <th colSpan="4" style={{ textAlign: 'center' }}>Current Channels</th>
                                    <th style={{ textAlign: 'center' }}>Status</th>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th>V1</th>
                                    <th>V2</th>
                                    <th>V3</th>
                                    <th>V4</th>
                                    <th>I1</th>
                                    <th>I2</th>
                                    <th>I3</th>
                                    <th>I4</th>
                                    <th></th>
                                </tr>
                            </thead>
                                <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="11" style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</td>
                                    </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan="11" style={{ textAlign: 'center', marginTop: '50px' }}>{error}</td>
                                        </tr>
                                    ) : Array.isArray(historyData) && historyData.length > 0 ? (
                                        
                                        historyData.map((dataItem, index) => (
                                          
                                        <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{dataItem.DEVID}</td>
                                        <td>{dataItem.VC.v1}</td>
                                            <td>{dataItem.VC.v2}</td>
                                            <td>{dataItem.VC.v3}</td>
                                            <td>{dataItem.VC.v4}</td>
                                            <td>{dataItem.CC.i1/1000}</td>
                                            <td>{dataItem.CC.i2/1000}</td>
                                            <td>{dataItem.CC.i3/1000}</td>
                                            <td>{dataItem.CC.i4/1000}</td>
                                        {dataItem.SIGSTATUS.status === 'OK' ? <td><span className="badge bg-success">Active</span></td> : <td><span className="badge bg-danger">Inactive</span></td>}
                                        </tr>
                                        
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="11" style={{ textAlign: 'center', marginTop: '50px' }}>No device found.</td>
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

export default SignalHmuHistory
