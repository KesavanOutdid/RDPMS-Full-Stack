import React from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const Header = () => {
  return (
     // <!-- Navbar -->
    <nav className="main-header navbar navbar-expand navbar-white navbar-light" id="headbar-dark">
        {/* Left navbar links */}
        <ul className="navbar-nav">
            <li className="nav-item">
                <Link className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></Link>
            </li>
            <li className="nav-item d-none d-sm-inline-block">
                <Link href="signal_hmu.html" className="nav-link">Home</Link>
            </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
            <li className="nav-item" id="darkmode-btn">
                <div className="nav-link">
                    <i className="fas fa-moon"></i>
                </div>
            </li>
            <li className="nav-item">
                <Link className="nav-link" data-widget="fullscreen" href="#" role="button">
                    <i className="fas fa-expand-arrows-alt"></i>
                </Link>
            </li>
        </ul>
    </nav>
  );
};

export default Header
