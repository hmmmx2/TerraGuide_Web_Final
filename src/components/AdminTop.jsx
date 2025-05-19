import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/authContext/supabaseAuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../top.css';
import terraguideLogo from '../assets/TerraGuide_Logo.png';
import user_sample from '../assets/sample.png';
import guest_avatar from '../assets/guest_user.jpeg';
import { doSignOut } from '../supabase/auth.js';

function AdminTop() {
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
        exitGuestMode();
        navigate('/');
      } else {
        await doSignOut();
        navigate('/');
      }
      setDropdownOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark shadow" style={{backgroundColor: '#4E6E4E'}}>
        <div className="container">
          <Link to="/dashboard" className="navbar-brand">
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
                <Link to="/dashboard" className="nav-link text-center fs-5">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard/database" className="nav-link text-center fs-5">Database</Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard/manage-users/view" className="nav-link text-center fs-5">User</Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard/license" className="nav-link text-center fs-5">License</Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard/content" className="nav-link text-center fs-5">Content</Link>
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
                        <Link 
                          to="/settings" 
                          className="dropdown-item" 
                          onClick={() => setDropdownOpen(false)}
                        >
                          Settings
                        </Link>
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
                  >
                    Sign Up
                  </Link>
                  <Link 
                    to="/" 
                    className="btn btn-light"
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

export default AdminTop;
