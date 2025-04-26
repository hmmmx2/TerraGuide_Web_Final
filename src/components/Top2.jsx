import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate, Link } from 'react-router-dom';
import '../top.css';
import terraguideLogo from '../assets/TerraGuide_Logo.png';
import user_sample from '../assets/sample.png';
import { doSignOut } from '../firebase/auth.js';

function Top2() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    const handleClick = () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    };

    hamburger.addEventListener('click', handleClick);

    return () => {
      hamburger.removeEventListener('click', handleClick);
    };
  }, []);

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return;

    try {
      await doSignOut();
      navigate('/');
      setDropdownOpen(false); // Close dropdown after logout
    } catch (error) {
      console.error("Logout error:", error);
      if (currentUser) {
        alert("Failed to log out. Please try again.");
      }
    }
  };

  return (
    <header>
      <nav>
        <div className="navbar-container">
          <div className="hamburger">
            <div></div>
            <div></div>
            <div></div>
          </div>

          <a href="#" className="logo">
            <img src={terraguideLogo} alt="TerraGuide Logo"/>
          </a>

          <div className="nav-links">
            <Link to="/index">Home</Link>
            <Link to="#">About Us</Link>
            <div className="dropdown">
              <Link to="#">My Courses</Link>
              <div className="dropdown-content">
                <Link to="#">Course 1</Link>
                <Link to="#">Course 2</Link>
              </div>
            </div>
            <Link to="#">Dext AI</Link>
            <Link to="#/Blogmenu">Blogs</Link>
            <Link to="#">Park Guide</Link>
          </div>

          <div className="auth-buttons">
            {currentUser ? (
              <div className="profile-menu">
              <div className="profile-circle" onClick={toggleDropdown}>
                <img src={user_sample} alt="Profile" />
              </div>
            
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Profile</Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Settings</Link>
                  <button onClick={handleLogout} className="dropdown-item">Logout</button>
                </div>
              )}
            </div>
            ) : (
              <>
                <Link to="/signup" className="sign-in">Sign Up</Link>
                <div className="separator"></div>
                <Link to="/" className="log-in">Log In</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Top2;