import React, { createContext, useContext, useState } from 'react';

// Create the notification context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [expandedAlerts, setExpandedAlerts] = useState({}); // Track expanded state for each alert

  // Toggle expanded state for an alert
  const toggleAlert = (id) => {
    setExpandedAlerts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Add a new notification
  const showNotification = (message, type = 'success', duration = 5000) => {
    const id = Date.now();
    const newNotification = {
      id,
      message,
      type,
      show: true
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-hide notification after duration
    if (duration) {
      setTimeout(() => {
        hideNotification(id);
      }, duration);
    }
    
    return id;
  };

  // Hide a notification by id
  const hideNotification = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, show: false } 
          : notification
      )
    );
    
    // Remove from state after animation completes
    setTimeout(() => {
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
    }, 300);
  };

  // Show an intruder alert notification with more detailed message
  const showIntruderAlert = (alertData = {
    message: 'Intruder Approaching To The Restricted Area',
    area: 'Park 1',
    time: new Date().toLocaleString(),
    image_url: null,
    distance_cm: null
  }) => {
    // Play an alert sound if available
    try {
      const audio = new Audio('/alert-sound.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (error) {
      console.log('Audio not supported');
    }
    
    // Create a notification with the alert data
    const id = Date.now();
    const newNotification = {
      id,
      ...alertData,
      type: 'danger',
      show: true
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-hide notification after longer duration for important alerts
    setTimeout(() => {
      hideNotification(id);
    }, 15000);
    
    return id;
  };

  const value = {
    notifications,
    expandedAlerts,
    toggleAlert,
    showNotification,
    hideNotification,
    showIntruderAlert
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Global notification display */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
        {notifications.map(notification => (
          notification.show && (
            <div 
              key={notification.id} 
              className="toast show" 
              role="alert" 
              aria-live="assertive" 
              aria-atomic="true"
              style={{ 
                minWidth: '300px', 
                maxWidth: '400px',
                marginBottom: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              {notification.type === 'danger' ? (
                // Enhanced alert notification styled like AlertList
                <>
                  <div 
                    className="toast-header" 
                    style={{ 
                      backgroundColor: '#dc3545',
                      color: 'white',
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                      padding: '10px 15px'
                    }}
                  >
                    <strong className="me-auto">
                      <i className="fas fa-exclamation-triangle me-2"></i> ALERT
                    </strong>
                    <button 
                      type="button" 
                      className="btn-close btn-close-white" 
                      onClick={() => hideNotification(notification.id)}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="toast-body p-0">
                    <div className="alert-item p-3">
                      <div className="alert-item__content">
                        <h3 className="alert-item__heading mb-2">{notification.message}</h3>
                        <p className="alert-item__meta mb-1">
                          <i className="far fa-clock me-1"></i> {notification.time || new Date().toLocaleString()}
                        </p>
                        <p className="alert-item__meta mb-2">
                          <i className="fas fa-map-marker-alt me-1"></i> {notification.area || 'Park 1'}
                        </p>
                        
                        {/* Toggle button for details */}
                        <button 
                          className="btn btn-sm btn-outline-secondary w-100 mb-2"
                          onClick={() => toggleAlert(notification.id)}
                          style={{ transition: 'all 0.3s ease' }}
                        >
                          {expandedAlerts[notification.id] ? 'Hide Details' : 'Show Details'}
                        </button>
                        
                        {/* Expandable content */}
                        {expandedAlerts[notification.id] && (
                          <div className="mt-2">
                            {notification.image_url && (
                              <div className="mb-2">
                                <img 
                                  src={notification.image_url} 
                                  alt="Intruder detection" 
                                  className="img-fluid rounded"
                                  style={{ maxHeight: '150px', width: '100%', objectFit: 'cover' }}
                                />
                              </div>
                            )}
                            {notification.distance_cm && (
                              <p className="alert-item__meta mb-0">
                                <i className="fas fa-ruler me-1"></i> Distance: {notification.distance_cm} cm
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Regular notification
                <>
                  <div 
                    className="toast-header" 
                    style={{ 
                      backgroundColor: notification.type === 'warning' ? '#ffc107' : 
                                      notification.type === 'success' ? '#4E6E4E' : '#4E6E4E',
                      color: notification.type === 'warning' ? 'black' : 'white' 
                    }}
                  >
                    <strong className="me-auto">
                      {notification.type === 'warning' ? 'Warning' : 
                      notification.type === 'success' ? 'Success' : 'Notification'}
                    </strong>
                    <button 
                      type="button" 
                      className="btn-close btn-close-white" 
                      onClick={() => hideNotification(notification.id)}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="toast-body">
                    {notification.message}
                  </div>
                </>
              )}
            </div>
          )
        ))}
      </div>
    </NotificationContext.Provider>
  );
};