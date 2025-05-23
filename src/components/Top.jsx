import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/authContext/supabaseAuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../top.css';
import terraguideLogo from '../assets/TerraGuide_Logo.png';
import user_sample from '../assets/sample.png';
import guest_avatar from '../assets/guest_user.jpeg';
import { doSignOut } from '../supabase/auth.js';
import { supabase } from '../supabase/supabase'; // Add this import

function Top() {
  const { currentUser, userLoggedIn, isGuestMode, exitGuestMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);
  const [username, setUsername] = useState(null); // Change to null instead of empty string
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch username when currentUser changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchUsername = async () => {
      if (currentUser && currentUser.id) {
        try {
          // Check if we have username in sessionStorage first
          const cachedUsername = sessionStorage.getItem('terraGuideUsername');
          if (cachedUsername) {
            setUsername(cachedUsername);
          }
          
          // Still fetch from database to ensure we have the latest
          const { data, error } = await supabase
            .from('users')
            .select('username')
            .eq('supabase_uid', currentUser.id)
            .single();
          
          if (isMounted) {
            if (data && data.username) {
              setUsername(data.username);
              // Cache the username in sessionStorage
              sessionStorage.setItem('terraGuideUsername', data.username);
            } else if (currentUser.user_metadata?.first_name) {
              // Fallback to first name from metadata if username not found
              setUsername(currentUser.user_metadata.first_name);
              // Cache the username in sessionStorage
              sessionStorage.setItem('terraGuideUsername', currentUser.user_metadata.first_name);
            }
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      } else if (isGuestMode) {
        setUsername('Guest');
      }
    };
    
    fetchUsername();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [currentUser, isGuestMode]);
  
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
      await doSignOut();
      
      // Only navigate with logout message if we're not already on the login page
      if (location.pathname !== '/') {
        navigate('/', { 
          state: { 
            message: 'Logout successful!', 
            type: 'danger' // Using danger type for red color
          } 
        });
      } else {
        // Just navigate to login without message if we're already there
        navigate('/');
      }
      
      setDropdownOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
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
          <Link to="/index" className="navbar-brand d-flex align-items-center">
            <img src={terraguideLogo} alt="TerraGuide Logo" className="img-fluid" style={{maxHeight: "60px", width: "auto"}} />
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
          
          <div className={`collapse navbar-collapse ${navbarCollapsed ? '' : 'show'} rounded-3`}>
            <ul className="navbar-nav justify-content-center w-100 mb-2 mb-lg-0">
              <li className="nav-item">
                <Link 
                  to="/index" 
                  className={`nav-link text-center fs-5 ${location.pathname === '/index' ? 'bg-white text-success rounded-3' : 'text-white'}`}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/aboutus" 
                  className={`nav-link text-center fs-5 ${location.pathname === '/aboutus' ? 'bg-white text-success rounded-3' : 'text-white'}`}
                >
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/mycourses" 
                  className={`nav-link text-center fs-5 ${location.pathname === '/mycourses' ? 'bg-white text-success rounded-3' : 'text-white'}`}
                >
                  My Courses
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/identify" 
                  className={`nav-link text-center fs-5 ${location.pathname === '/identify' ? 'bg-white text-success rounded-3' : 'text-white'}`}
                >
                  Dext AI
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/blogmenu" 
                  className={`nav-link text-center fs-5 ${location.pathname === '/blogmenu' ? 'bg-white text-success rounded-3' : 'text-white'}`}
                >
                  Blogs
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/guide" 
                  className={`nav-link text-center fs-5 ${location.pathname === '/guide' ? 'bg-white text-success rounded-3' : 'text-white'}`}
                >
                  Park Guide
                </Link>
              </li>
            </ul>
            
            <div className="container d-flex justify-content-between align-items-center">
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
                    
                    {/* Add username display */}
                    {/* Username display with line break */}
                    <div className="me-3 text-white" style={{whiteSpace: 'nowrap', lineHeight: '1.2'}}>
                      <div>Welcome,</div>
                      <div>
                        {username || (isGuestMode ? 'Guest' : (
                          <span className="opacity-75">
                            <i className="fas fa-spinner fa-spin fa-sm me-1"></i>Loading...
                          </span>
                        ))}
                      </div>
                    </div>
                    
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
