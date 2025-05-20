import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/authContext/supabaseAuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../top.css';
import terraguideLogo from '../assets/TerraGuide_Logo.png';
import user_sample from '../assets/sample.png';
import guest_avatar from '../assets/guest_user.jpeg';
import { doSignOut } from '../supabase/auth.js';

function Top() {
  const { currentUser, userLoggedIn, isGuestMode, exitGuestMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

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

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    try {
      if (isGuestMode) {
        // For guest mode, just clear localStorage and update state
        exitGuestMode();
        navigate('/');
      } else {
        // For regular users, sign out from Supabase
        await doSignOut();
        navigate('/');
      }
      setDropdownOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to log out. Please try again.');
    }
  };

  // Check if current path is login or register
  const isLoginPage = location.pathname === '/';
  const isRegisterPage = location.pathname === '/signup';

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark shadow" style={{backgroundColor: '#4E6E4E', width: '100%'}}>
        <div className="container">
          <Link to="/index" className="navbar-brand">
            <img src={terraguideLogo} alt="TerraGuide Logo" height="60" />
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setNavbarCollapsed(!navbarCollapsed)}
            aria-expanded={!navbarCollapsed}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className={`collapse navbar-collapse ${navbarCollapsed ? '' : 'show'}`}>
            <ul className="navbar-nav justify-content-center w-100 mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/index" className="nav-link text-center fs-5">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/aboutus" className="nav-link text-center fs-5">About Us</Link>
              </li>
              <li className="nav-item">
                <Link to="/mycourses" className="nav-link text-center fs-5">My Courses</Link>
              </li>
              <li className="nav-item">
                <Link to="/identify" className="nav-link text-center fs-5">Dext AI</Link>
              </li>
              <li className="nav-item">
                <Link to="/blogmenu" className="nav-link text-center fs-5">Blogs</Link>
              </li>
              <li className="nav-item">
                <Link to="/guide" className="nav-link text-center fs-5">Park Guide</Link>
              </li>
            </ul>
            
            <div className="d-flex align-items-center">
              {userLoggedIn ? (
                <div className="position-relative" ref={dropdownRef}>
                  <div className="d-flex align-items-center">
                    <div 
                      className="position-relative me-3" 
                      ref={searchRef}
                    >
                      <div className="input-group" style={{width: isActive ? '200px' : '40px', transition: 'width 0.3s'}}>
                        <span className="input-group-text bg-transparent border-0 text-white" onClick={() => setIsActive(!isActive)}>
                          <i className="fas fa-search"></i>
                        </span>
                        {isActive && (
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search..." 
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="me-3 text-white">
                      <i className="fas fa-bell"></i>
                    </div>
                    
                    {isGuestMode && (
                      <span className="badge bg-warning text-dark me-2">
                        GUEST
                      </span>
                    )}
                    
                    <div 
                      onClick={() => setDropdownOpen(!dropdownOpen)} 
                      style={{cursor: 'pointer'}}
                    >
                      <img 
                        src={isGuestMode ? guest_avatar : user_sample} 
                        alt="Profile" 
                        className="rounded-circle" 
                        width="40" 
                        height="40" 
                      />
                    </div>
                  </div>
                  
                  {dropdownOpen && (
                    <div className="position-absolute end-0 mt-2 py-2 bg-white rounded shadow" style={{minWidth: '200px', zIndex: 1000}}>
                      {!isGuestMode && (
                        <>
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
                          <div className="dropdown-divider"></div>
                        </>
                      )}
                      {isGuestMode && (
                        <div className="dropdown-item text-muted fst-italic">
                          Guest Mode Active
                        </div>
                      )}
                      <button 
                        onClick={handleLogout} 
                        className="dropdown-item text-danger"
                      >
                        {isGuestMode ? 'Exit Guest Mode' : 'Logout'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="d-flex">
                  <Link 
                    to="/signup" 
                    className="btn btn-outline-light me-2"
                    style={{ backgroundColor: isRegisterPage ? 'white' : 'transparent', color: isRegisterPage ? '#198754' : 'white' }}
                  >
                    Sign Up
                  </Link>
                  <Link 
                    to="/" 
                    className="btn btn-light"
                    style={{ backgroundColor: isLoginPage ? 'white' : 'transparent', color: isLoginPage ? '#198754' : 'white' }}
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Top;
