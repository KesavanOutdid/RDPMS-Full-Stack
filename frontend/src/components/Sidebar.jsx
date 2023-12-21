import React from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { useState, useEffect } from 'react';

const Sidebar = () => {

    const [activeButton, setActiveButton] = useState(localStorage.getItem('activeButton') || 'none');

    const handleButtonClick = (button) => {
      setActiveButton(button);
      localStorage.setItem('activeButton', button);
    };
  
    useEffect(() => {
      // When the component mounts, retrieve the active button from local storage (if available).
      const storedActiveButton = localStorage.getItem('activeButton');
      if (storedActiveButton) {
        setActiveButton(storedActiveButton);
      }
    }, []);

  return (

    //  Main Sidebar Container 
    <aside className="main-sidebar elevation-4 sidebar-light-info" id="sidebar-dark">
        {/* Brand Logo */}
        <Link to="/" className="brand-link">
            <img src="dist/img/logo-mini.png" alt="Sensedge Logo" className="brand-image img-circle elevation-3" style={{ opacity: 0.8 }}/>
            <img src="dist/img/logo.png" alt="Sensedge Logo" className="brand-text font-weight-light"/>
        </Link>
        {/* Sidebar User */}
        <div className="sidebar" style={{ overflowY: 'auto'}}>

            {/* Sidebar Menu */}
            <nav className="mt-2">
                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    <li className="nav-item menu-open">
                        <Link className="nav-link active" id="gear-head">
                            <i className="nav-icon fas fa-tachometer-alt"></i>
                            <p>
                                Gear's
                                <i className="right fas fa-angle-left"></i>
                            </p>
                        </Link>
                        <ul className="nav nav-treeview" id="gears">
                            <li className="nav-item">
                               <Link to="/"  className="nav-link sub-gears"  id={activeButton === 'button1' ? 'active-button' : ''}
                                    onClick={() => handleButtonClick('button1')}>
                                    <i className="nav-icon text-info">1.</i>
                                    <p>Signal HMU</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                               <Link to="/pointhmu"  className="nav-link sub-gears"  id={activeButton === 'button2' ? 'active-button' : ''}
                                    onClick={() => handleButtonClick('button2')}>
                                    <i className="nav-icon text-info">2.</i>
                                    <p>Point HMU</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                               <Link to="/trackhmu"  className="nav-link sub-gears"  id={activeButton === 'button3' ? 'active-button' : ''}
                                    onClick={() => handleButtonClick('button3')}>
                                    <i className="nav-icon text-info">3.</i>
                                    <p>Track HMU</p>
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    </aside>
  );
};

export default Sidebar
