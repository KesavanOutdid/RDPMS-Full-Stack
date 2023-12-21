import React from 'react'

function Footer() {
  const year = new Date();
  return (
    // <!-- Main Footer -->
      <footer className="main-footer" >
          <strong>Copyright &copy; {year.getFullYear()} <a href="https://www.sensedgetss.com/">sensedge</a>.</strong> All rights reserved.
      </footer>
        
  );
};

export default Footer
