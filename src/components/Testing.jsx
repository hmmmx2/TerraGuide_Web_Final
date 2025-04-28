import React, { useState, useRef, useEffect } from 'react';

const Testing = () => {
  const [isActive, setIsActive] = useState(false);
  const searchRef = useRef(null);

  const toggleSearch = () => {
    setIsActive(!isActive);
  };

  // Optional: Close search if clicked outside
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

  return (
    <div style={styles.body}>
      <div style={styles.iconBar}>
        <div
          style={{
            ...styles.searchContainer,
            ...(isActive ? styles.activeSearchContainer : {}),
          }}
          ref={searchRef}
        >
          <i
            className="fas fa-search"
            style={styles.icon}
            onClick={toggleSearch}
          ></i>
          <input
            type="text"
            placeholder="Search..."
            style={{
              ...styles.searchInput,
              ...(isActive ? styles.activeSearchInput : {}),
            }}
          />
        </div>
        <i className="fas fa-bell" style={styles.icon}></i>
        <img
          src="your-image-url-here"
          alt="Profile"
          style={styles.profilePic}
        />
      </div>
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: '#4f6b4f',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },
  activeSearchContainer: {
    // Optional: add if you want the container to expand too
  },
  searchInput: {
    width: 0,
    padding: 0,
    opacity: 0,
    border: 'none',
    borderBottom: '2px solid #ccc',
    background: 'transparent',
    color: 'white',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  activeSearchInput: {
    width: '150px',
    padding: '5px',
    opacity: 1,
  },
  icon: {
    fontSize: '24px',
    color: '#f0f0e0',
    cursor: 'pointer',
  },
  profilePic: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    cursor: 'pointer',
  },
};

export default Testing;
