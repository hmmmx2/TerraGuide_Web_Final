import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/authContext/supabaseAuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../top.css';
import terraguideLogo from '../assets/TerraGuide_Logo.png';
import user_sample from '../assets/sample.png';
import guest_avatar from '../assets/guest_user.jpeg';
import { doSignOut } from '../supabase/auth.js';
import { supabase } from '../supabase/supabase'; // Add this import

function AdminTop() {
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
      }
    };
    
    fetchUsername();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [currentUser]);
  
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
      // Navigate with state to pass the logout message
      navigate('/', { 
        state: { 
          message: 'Logout successful!', 
          type: 'danger' // Using danger type for red color
        } 
      });
      setDropdownOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark shadow" style={{backgroundColor: '#4E6E4E', width: '100%'}}>
        <div className="container">
          <Link to="/dashboard" className="navbar-brand d-flex align-items-center">
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
          
          <div className={`collapse navbar-collapse ${navbarCollapsed ? '' : 'show'}`}>
            <ul className="navbar-nav justify-content-center w-100 mb-2 mb-lg-0">
              <li className="nav-item">
                <Link 
                  to="/dashboard" 
                  className={`nav-link text-center fs-5 text-white ${location.pathname === '/dashboard' ? 'rounded-3' : ''}`}
                  style={{
                    backgroundColor: location.pathname === '/dashboard' ? '#72986f' : '',
                    transition: 'all 0.3s'
                  }}
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/database" 
                  className={`nav-link text-center fs-5 text-white ${location.pathname === '/database' ? 'rounded-3' : ''}`}
                  style={{
                    backgroundColor: location.pathname === '/database' ? '#72986f' : '',
                    transition: 'all 0.3s'
                  }}
                >
                  Database
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/aipage" 
                  className={`nav-link text-center fs-5 text-white ${location.pathname === '/aipage' || location.pathname === '/identify' ? 'rounded-3' : ''}`}
                  style={{
                    backgroundColor: location.pathname === '/aipage' || location.pathname === '/identify' ? '#72986f' : '',
                    transition: 'all 0.3s'
                  }}
                >
                  Dext AI
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/dashboard/manage-users/view" 
                  className={`nav-link text-center fs-5 text-white ${location.pathname === '/dashboard/manage-users/view' ? 'rounded-3' : ''}`}
                  style={{
                    backgroundColor: location.pathname === '/dashboard/manage-users/view' ? '#72986f' : '',
                    transition: 'all 0.3s'
                  }}
                >
                  User
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/license" 
                  className={`nav-link text-center fs-5 text-white ${location.pathname === '/license' ? 'rounded-3' : ''}`}
                  style={{
                    backgroundColor: location.pathname === '/license' ? '#72986f' : '',
                    transition: 'all 0.3s'
                  }}
                >
                  License
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/course" 
                  className={`nav-link text-center fs-5 text-white ${location.pathname === '/course' ? 'rounded-3' : ''}`}
                  style={{
                    backgroundColor: location.pathname === '/course' ? '#72986f' : '',
                    transition: 'all 0.3s'
                  }}
                >
                  Content
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/timetable-management" className={`nav-link text-center fs-5 ${location.pathname === '/timetable-management' ? 'bg-white text-success rounded-3' : 'text-white'}`}>
                  Timetable
                </Link>
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
                    
                    <Link to="/notification" className="me-3 text-white" style={{ textDecoration: 'none' }}>
                      <i className="fas fa-bell"></i>
                    </Link>
                    
                    {/* Username display */}
                    <div className="me-3 text-white" style={{whiteSpace: 'nowrap', lineHeight: '1.2'}}>
                      <div>Welcome,</div>
                      <div>
                        {username || (
                          <span className="opacity-75">
                            <i className="fas fa-spinner fa-spin fa-sm me-1"></i>Loading...
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => setDropdownOpen(!dropdownOpen)} 
                      style={{cursor: 'pointer'}}
                    >
                      <i className="fas fa-user-circle fa-2x text-white"></i>
                    </div>
                  </div>
                  
                  {dropdownOpen && (
                    <div className="position-absolute end-0 mt-2 py-2 bg-white rounded shadow" style={{minWidth: '200px', zIndex: 1000}}>
                      <Link 
                        to="/settings" 
                        className="dropdown-item" 
                        onClick={() => setDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button 
                        onClick={handleLogout} 
                        className="dropdown-item text-danger"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="d-flex">
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