import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// import page
import SignalHmu from './page/SignalHmu';
import PointHmu from './page/PointHmu';
import TrackHmu from './page/TrackHmu';
import SignalHmuHistory from './page/SignalHmuHistory';
import SignalHmuGraph from './page/SignalHmuGraph';
import PointHmuHistory from './page/PointHmuHistory';
import PointHmuGraph from './page/PointHmuGraph';
import TrackHmuHistory from './page/TrackHmuHistory';
import TrackHmuGraph from './page/TrackHmuGraph';

// import components
import Header from './components/Header'; 
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
const App = () => {
  return (
    <Router>
      <div className="app wrapper">
        <Header/>
        <Sidebar/> 
        <Switch>
          <Route path="/" exact component={SignalHmu}/>
          <Route path="/pointhmu" component={PointHmu}/>
          <Route path="/trackhmu" component={TrackHmu}/>
          <Route path="/signalhmuhistory" component={SignalHmuHistory}/>
          <Route path="/signalhmugraph" component={SignalHmuGraph}/>
          <Route path="/pointhmuhistory" component={PointHmuHistory}/>
          <Route path="/pointhmugraph" component={PointHmuGraph}/>
          <Route path="/trackhmuhistory" component={TrackHmuHistory}/>
          <Route path="/trackhmugraph" component={TrackHmuGraph}/>
        </Switch>
        <Footer/>
      </div>
    </Router>
  );
};

export default App;
