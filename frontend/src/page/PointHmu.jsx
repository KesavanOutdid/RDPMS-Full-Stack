import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function PointHmu() {
  const [data, setData] = useState([]);
  const [activeData, setActionData] = useState([]);
  const [filteredData, setSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actCount, setActCount] = useState(0);
  const [inactCount, setInactCount] = useState(0);
  const [posts, setPosts] = useState([]);
  console.log(setSearch);
  useEffect(() => {
    // Create a CustomEvent to specify the 'module' detail
    const event = new CustomEvent('reloadPage', { detail: 'Point HMU' });
    window.dispatchEvent(event);

    // Define the API URL based on the event detail
    const url = `http://localhost:9000/FetchDevices?module=${event.detail}`;
    axios.get(url).then((res) => {
        // console.log('Data fetched successfully:', res.data);
        setData(res.data.data); // Assuming the data you need is inside the 'data' property
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError('Error fetching data. Please try again.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Calculate active and inactive counts when data changes
    let activeCount = 0;
    let inactiveCount = 0;

    data.forEach((item) => {
      const status = item.status;
      if (status === 1) {
        activeCount++;
      } else {
        inactiveCount++;
      }
    });

    setActCount(activeCount);
    setInactCount(inactiveCount);
  }, [data]);

  //All data
  const handleClick = () => {
    const updatedData = data.map((item) => {
      return item;
    });
    // Update the state with the modified data
    setActionData(updatedData);
    setPosts(updatedData); // Set posts to the default 'data'
  }

  //Active data
  const handleClickAct = () => {
    // Filter the data to include only items with status === 1
    const activeData = data.filter((item) => item.status === 1);
    // Log the specific properties of the updated data
    // activeData.forEach((item) => {
    //   console.log(`ID: ${item.device_id}, Status: ${item.status}`);
    // });
    // Update the state with the filtered data
      setPosts(activeData); // Set posts to the filtered 'activeData'
  }

  // Inactive data
  const handleClickInact = () => {
    const inactiveData = data.filter((item) => item.status !==1);
    // Update the state with the filtered data using setActionData
    setPosts(inactiveData); // Set posts to the filtered 'inactiveData'
  }
  
  const handleSearchInputChange = (e) => {
    const inputValue = e.target.value.toUpperCase();
    // Filter the data array based on the input value (converted to uppercase)
    const filteredData = data.filter((item) =>
      item.device_id.toString().toUpperCase().includes(inputValue)
    );
    // console.log('Filtered Data:', filteredData);
    // Update the search state with the filtered results
    //setSearch(filteredData);
    setPosts(filteredData); // Set posts to the filteredData
  };

  // Update 'posts' based on 'data', 'activeData', 'filteredData'
  useEffect(() => {
    switch (data) {
      case 'activeData':
        setPosts(activeData);
        break;
      case 'filteredData':
        setPosts(filteredData);
        break;
      default:
        setPosts(data);
        break;
    }
  }, [data, activeData, filteredData]);
  return (
	<div className="content-wrapper" id="main-dashboard">
        <div className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1 className="m-0">Dashboard</h1>
                    </div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right" id="mod">
                            <li className="breadcrumb-item">Dashboard</li>
                            <li className="breadcrumb-item active dash-head" id="Point Machines">Point HMU</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>

        {/*  Top Header-box content */}
        <div className="content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-4 col-6">
                        <div className="small-box bg-info">
                            <div className="inner">
                                <div id="total-devices">
                                    <h3>{data.length}</h3>
                                </div>
                                <p>Total Device's</p>
                            </div>
                            <div className="icon">
                                <i className="fas fa-globe"></i>
                            </div>
                            <Link className="small-box-footer" id="view-all" onClick={() => handleClick(data)}>View <i className="fas fa-arrow-circle-right"></i></Link>
                        </div>
                    </div>

                    <div className="col-lg-4 col-6">
                        <div className="small-box bg-success">
                            <div className="inner">
                                <div id="active-devices">
                                    <h3>{actCount}</h3>
                                </div>
                                <p>Active Device's</p>
                            </div>
                            <div className="icon">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <Link className="small-box-footer" id="view-active" onClick={() => handleClickAct(data)}>View <i className="fas fa-arrow-circle-right"></i></Link>
                        </div>
                    </div>

                    <div className="col-lg-4 col-6">
                        <div className="small-box bg-danger">
                            <div className="inner">
                                <div id="inactive-devices">
                                    <h3>{inactCount}</h3>
                                </div>
                                <p>Inactive Device's</p>
                            </div>
                             <div className="icon">
                                <i className="fas fa-exclamation-circle"></i>
                            </div>
                            <Link className="small-box-footer" id="view-inactive" onClick={() => handleClickInact(data)}>View <i className="fas fa-arrow-circle-right"></i></Link>
                        </div>
                    </div>
                </div>

                {/* Device List */}
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title dash-head">Point HMU</h3>
                                    <div className="card-tools">
                                        <div className="input-group input-group-sm" style={{width:'200px'}}>
                                            <input type="text" name="table_search" className="form-control float-right srchFld" placeholder="Search Devices" autocomplete="off"
                                            onChange={handleSearchInputChange}/>                                        
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body table-responsive p-0" style={{height:'300px'}}>
                                    <table className="table table-head-fixed text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>Sl.No</th>
                                                <th>Device ID</th>
                                                <th>Created On</th>
                                                <th>Status</th>
                                                <th style={{textAlign:'center'}}>View Live Data</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                          {loading ? (
                                            <tr>
                                              <td colSpan="5" style={{ marginTop: '50px', textAlign: 'center' }}>Loading...</td>
                                            </tr>
                                          ) : error ? (
                                            <tr>
                                              <td colSpan="5" style={{ marginTop: '50px', textAlign: 'center' }}>Error: {error}</td>
                                            </tr>
                                          ) : (
                                            Array.isArray(posts) && posts.length > 0 ? (
                                              posts.map((dataItem, index) => (
                                                <tr key={index}>
                                                  <td>{index + 1}</td>
                                                  <td>{dataItem.device_id}</td>
                                                  <td>{dataItem.created_date}</td>
                                                  <td>
                                                    {dataItem.status === 1 ? (
                                                      <span className="badge bg-success">Active</span>
                                                    ) : (
                                                      <span className="badge bg-danger">Inactive</span>
                                                    )}
                                                  </td>
                                                  <td>
                                                    <Link to={`/Pointhmuhistory/?device_name=${dataItem.device_id}&&module=${dataItem.module_name}`}>
                                                      <button type="button" className="btn btn-block btn-primary">View</button>
                                                    </Link>
                                                  </td>
                                                </tr>
                                              ))
                                            ) : (
                                              <tr>
                                                <td colSpan="5" style={{ marginTop: '50px', textAlign: 'center' }}>No devices found.</td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            
    );
};

export default PointHmu
