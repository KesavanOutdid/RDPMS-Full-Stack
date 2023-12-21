import React from 'react'

import { Link } from 'react-router-dom/cjs/react-router-dom.min';
function SignalHmuGraph() {
  return (
    <div className="content-wrapper" style={{ minHeight: '817px' }} id="graphData">
        <section className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6 module-name"><h1>Signal HMU</h1></div>
                    <div className="col-sm-6" id="back-page">                                    
                        <ol className="breadcrumb float-sm-right">
                            <Link to="/signalhmuhistory"><button type="button" className="btn btn-info">Back</button></Link>
                        </ol>
                    </div>
                </div>
            </div>
        </section>

        <section className="content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card card-primary card-outline">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <i className="far fa-chart-bar"></i> History Chart
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="d-sm-flex justify-content-between align-items-start">
                                    <div id="graphDeviceID"></div>
                                </div>
                                <div className="chartjs-wrapper mt-5"><div className="chartjs-size-monitor"><div className="chartjs-size-monitor-expand"><div className=""></div></div><div className="chartjs-size-monitor-shrink"><div className=""></div></div></div>
                                    <canvas id="performaneLine" style={{display:'block', width:'1599px', height:'150px'}} width="1599" height="150" className="chartjs-render-monitor"></canvas>
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

export default SignalHmuGraph
