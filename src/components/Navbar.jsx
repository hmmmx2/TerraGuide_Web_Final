import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Update path as needed

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav id="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Terra Guide Logo" />
      </div>
      
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li className="navbar-dropdown">
          <div className="navbar-dropbtn">
            <Link to="/courses">My Courses</Link>
            <i className="fas fa-caret-down"></i>
          </div>
          <div className="dropdown-content">
            <Link to="/courses/current">Current Courses</Link>
            <Link to="/courses/completed">Completed Courses</Link>
          </div>
        </li>
        <li><Link to="/dext-ai">Dext AI</Link></li>
        <li><Link to="/blogs">Blogs</Link></li>
        <li><Link to="/park-guide">Park Guide</Link></li>
      </ul>
      
      <div className="nav-actions">
        <Link to="/register" className="action_btn1">Sign Up</Link>
        <Link to="/login" className="action_btn2">Login</Link>
      </div>
      
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </button>
      
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/courses">My Courses</Link></li>
          <li><Link to="/dext-ai">Dext AI</Link></li>
          <li><Link to="/blogs">Blogs</Link></li>
          <li><Link to="/park-guide">Park Guide</Link></li>
          <li><Link to="/register">Sign Up</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;