import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/authContext/supabaseAuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../top.css';
import terraguideLogo from '../assets/TerraGuide_Logo.png';
import user_sample from '../assets/sample.png';
import guest_avatar from '../assets/guest_user.jpeg';
import { doSignOut } from '../supabase/auth.js';
import { supabase } from '../supabase/supabase';

function Top() {
  const { currentUser, userLoggedIn, isGuestMode, exitGuestMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);
  const [username, setUsername] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch username and avatar when currentUser changes
  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      if (currentUser && currentUser.id && !isGuestMode) {
        try {
          const cachedUsername = sessionStorage.getItem('terraGuideUsername');
          if (cachedUsername) {
            setUsername(cachedUsername);
          }

          const cachedAvatar = sessionStorage.getItem('terraGuideAvatar');
          if (cachedAvatar) {
            setAvatarUrl(cachedAvatar);
          }

          const { data: parkGuideData, error: parkGuideError } = await supabase
            .from('park_guides')
            .select('username, avatar_url')
            .eq('supabase_uid', currentUser.id)
            .single();

          if (isMounted) {
            if (parkGuideError && parkGuideError.code !== 'PGRST116') {
              console.error('Error fetching park guide data:', parkGuideError);
              return;
            }

            if (parkGuideData) {
              if (parkGuideData.username) {
                setUsername(parkGuideData.username);
                sessionStorage.setItem('terraGuideUsername', parkGuideData.username);
              } else if (currentUser.user_metadata?.first_name) {
                setUsername(currentUser.user_metadata.first_name);
                sessionStorage.setItem('terraGuideUsername', currentUser.user_metadata.first_name);
              }

              if (parkGuideData.avatar_url) {
                const avatarWithCacheBust = `${parkGuideData.avatar_url}?t=${new Date().getTime()}`;
                setAvatarUrl(avatarWithCacheBust);
                sessionStorage.setItem('terraGuideAvatar', avatarWithCacheBust);
              } else {
                await fetchAvatarFromStorage(currentUser.id);
              }
            } else {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('username')
                .eq('supabase_uid', currentUser.id)
                .single();

              if (userError) {
                console.error('Error fetching username:', userError);
              }

              if (userData?.username) {
                setUsername(userData.username);
                sessionStorage.setItem('terraGuideUsername', userData.username);
              } else if (currentUser.user_metadata?.first_name) {
                setUsername(currentUser.user_metadata.first_name);
                sessionStorage.setItem('terraGuideUsername', currentUser.user_metadata.first_name);
              }

              await fetchAvatarFromStorage(currentUser.id);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else if (isGuestMode) {
        setUsername('Guest');
        setAvatarUrl(guest_avatar);
      } else {
        setUsername(null);
        setAvatarUrl(null);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [currentUser, isGuestMode]);

  // Function to fetch avatar from Supabase storage
  const fetchAvatarFromStorage = async (supabaseUid) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('avatar-images')
        .list(`parkguides/${supabaseUid}`);

      if (error) {
        console.error('Error fetching avatar:', error);
        setAvatarUrl(user_sample);
        return;
      }

      if (data && data.length > 0) {
        const avatarFile = data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        )[0];

        const { data: urlData } = await supabase
          .storage
          .from('avatar-images')
          .getPublicUrl(`parkguides/${supabaseUid}/${avatarFile.name}`);

        if (urlData?.publicUrl) {
          const avatarWithCacheBust = `${urlData.publicUrl}?t=${new Date().getTime()}`;
          setAvatarUrl(avatarWithCacheBust);
          sessionStorage.setItem('terraGuideAvatar', avatarWithCacheBust);
        } else {
          setAvatarUrl(user_sample);
        }
      } else {
        setAvatarUrl(user_sample);
      }
    } catch (error) {
      console.error('Error fetching avatar from storage:', error);
      setAvatarUrl(user_sample);
    }
  };

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
      sessionStorage.removeItem('terraGuideUsername');
      sessionStorage.removeItem('terraGuideAvatar');
      if (location.pathname !== '/') {
        navigate('/', { 
          state: { 
            message: 'Logout successful!', 
            type: 'danger'
          } 
        });
      } else {
        navigate('/');
      }
      setDropdownOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
      alert('Failed to log out. Please try again.');
    }
  };

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
                      <div className="rounded-circle overflow-hidden" style={{width: '40px', height: '40px'}}>
                        <img 
                          src={avatarUrl || (isGuestMode ? guest_avatar : user_sample)} 
                          alt="Profile" 
                          className="w-100 h-100 rounded-circle" 
                          style={{ objectFit: 'cover' }} 
                          onError={(e) => { e.target.src = user_sample; }}
                        />
                      </div>
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