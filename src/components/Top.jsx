import React, { useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate, Link } from 'react-router-dom';
import '../top.css';
import terraguideLogo from '../assets/TerraGuide_Logo.png';
import { doSignOut } from '../firebase/auth.js'; // Import from your auth.js

function Top() {
  const { currentUser } = useAuth(); // Remove logout from destructuring
  const navigate = useNavigate();

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
      await doSignOut(); // Use doSignOut directly from auth.js
      navigate('/'); // Use navigate instead of <Navigate>
    } catch (error) {
      console.error("Logout error:", error);
      // Only show error if user is still logged in
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
                  <button onClick={handleLogout} className="logout-button">
                    Log Out
                  </button>
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

export default Top;