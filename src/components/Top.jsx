import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/authContext/supabaseAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../top.css';
import terraguideLogo from '../assets/TerraGuide_Logo.png';
import user_sample from '../assets/sample.png';
import { doSignOut } from '../supabase/auth.js';

function Top() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const searchRef = useRef(null);

  const toggleSearch = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (!hamburger || !navLinks) return;

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

  // Styles for the search functionality
  const styles = {
    iconBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    searchContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.3s ease'
    },
    activeSearchContainer: {
      // Optional styles for active container
    },
    searchInput: {
      width: '0',
      padding: '0',
      opacity: '0',
      border: 'none',
      borderBottom: '2px solid #ccc',
      background: 'transparent',
      color: 'white',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    activeSearchInput: {
      width: '150px',
      padding: '5px',
      opacity: '1'
    },
    icon: {
      fontSize: '24px',
      color: '#f0f0e0',
      cursor: 'pointer'
    },
    profilePic: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
      cursor: 'pointer'
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
              <div class="profile-menu">
              {/* Search and notification section */}
              <div class="icon-bar">
                <div class={`search-container ${isActive ? 'active-search-container' : ''}`} ref={searchRef}>
                  <i class="fas fa-search icon" onClick={toggleSearch}></i>
                  <input
                    type="text"
                    placeholder="Search..."
                    class={`search-input ${isActive ? 'active-search-input' : ''}`}
                  />
                </div>
                <i class="fas fa-bell icon"></i>
              </div>
            
              {/* Profile dropdown section */}
              <div class="profile-circle" onClick={toggleDropdown}>
                <img src={user_sample} alt="Profile" class="profile-pic" />
              </div>
            
              {dropdownOpen && (
                <div class="dropdown-menu">
                  <Link to="/profile" class="dropdown-item" onClick={() => setDropdownOpen(false)}>Profile</Link>
                  <Link to="/settings" class="dropdown-item" onClick={() => setDropdownOpen(false)}>Settings</Link>
                  <button onClick={handleLogout} class="dropdown-item">Logout</button>
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

export default Top;