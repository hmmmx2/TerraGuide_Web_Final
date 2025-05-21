import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PO from '../components/PO';
import PC from '../components/PC';
import RMO from '../components/RMO';
import AlertList from '../components/AlertList';
import AdminTop from '../components/AdminTop';
import Footer1 from '../components/Footer1';
import '../dashboard.css';
import StatsCard from '../components/StatsCard';

export default function Dashboard() {
  const location = useLocation();
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  
  const sampleAlerts = [
    { title: 'Intruder Approaching To The Restricted Area', date: '18/3/2025, 4:00 pm', area: 'Park 1' },
    { title: 'Intruder Approaching To The Restricted Area', date: '18/3/2025, 2:30 pm', area: 'Park 3' },
    { title: 'Intruder Approaching To The Restricted Area', date: '16/3/2025, 1:35 pm', area: 'Park 6' },
    { title: 'Intruder Approaching To The Restricted Area', date: '15/3/2025, 12:03 pm', area: 'Park 4' },
  ];

  useEffect(() => {
    // Check if user just logged in
    const loginSuccess = sessionStorage.getItem('loginSuccess');
    if (loginSuccess === 'true') {
      // Show alert
      setAlert({
        show: true,
        message: 'Login successful!',
        type: 'success'
      });
      
      // Remove the flag from sessionStorage
      sessionStorage.removeItem('loginSuccess');
    }
    
    // Check for logout message from location state
    if (location.state?.message) {
      setAlert({
        show: true,
        message: location.state.message,
        type: location.state.type || 'danger'
      });
      
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Separate useEffect for auto-hiding the alert
  useEffect(() => {
    let timer;
    if (alert.show) {
      timer = setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
      }, 3000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [alert.show]);

  return (
    <>
      <AdminTop/>
      
      {/* Bootstrap 5 Alert */}
      {alert.show && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1100, width: "auto" }}>
          <div className={`alert alert-${alert.type} d-flex align-items-center py-2 px-4`} role="alert">
            <div className="d-flex w-100 justify-content-between align-items-center">
              <div>
                <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} me-2`}></i>
                {alert.message}
              </div>
              <button 
                type="button" 
                className="btn-close ms-3" 
                onClick={() => setAlert(prev => ({ ...prev, show: false }))} 
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      )}
      
      <StatsCard/>
      <div className="dashboard-container">
        <PO />
        <PC />
        <RMO />
        <AlertList
        alerts={sampleAlerts}
        title="Alert"
        linkText="All alerts"
        linkTo="/alertspage"
        />
      </div>
      <Footer1/>
    </>
  );
}
