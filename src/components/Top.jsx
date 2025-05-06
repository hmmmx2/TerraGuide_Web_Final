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
  const [isActive, setIsActive]       = useState(false);
  const searchRef    = useRef(null);
  const dropdownRef  = useRef(null);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsActive(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hamburger toggle for mobile
  useEffect(() => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    function toggle() {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    }

    hamburger.addEventListener('click', toggle);
    return () => hamburger.removeEventListener('click', toggle);
  }, []);

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    try {
      await doSignOut();
      navigate('/');
      setDropdownOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <header>
      <nav>
        <div className="navbar-container">
          <div className="hamburger">
            <div/><div/><div/>
          </div>

          <Link to="/index" className="logo">
            <img src={terraguideLogo} alt="TerraGuide Logo"/>
          </Link>

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
            <Link to="/Blogmenu">Blogs</Link>
            <Link to="/guide">Park Guide</Link>
          </div>

          <div className="auth-buttons">
            {currentUser ? (
              <div
                className={`profile-menu${dropdownOpen ? ' open' : ''}`}
                ref={dropdownRef}
              >
                <div className="icon-bar">
                  <div
                    className={`search-container${isActive ? ' active-search-container' : ''}`}
                    ref={searchRef}
                  >
                    <i
                      className="fas fa-search icon"
                      onClick={() => setIsActive(a => !a)}
                    />
                    <input
                      type="text"
                      placeholder="Search..."
                      className={`search-input${isActive ? ' active-search-input' : ''}`}
                    />
                  </div>
                  <i className="fas fa-bell icon"/>
                </div>

                <div
                  className="profile-circle"
                  onClick={() => setDropdownOpen(o => !o)}
                >
                  <img src={user_sample} alt="Profile"/>
                </div>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signup" className="sign-in">Sign Up</Link>
                <div className="separator"/>
                <Link to="/"      className="log-in">Log In</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Top;
