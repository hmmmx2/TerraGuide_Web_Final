// src/components/AlertList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../alert_list.css';
import { supabase } from '../supabase/supabase';

export default function AlertList({
  title = 'Alert',
  linkText = '',
  linkTo = '',
  onLinkClick,
  fetchFromSupabase = true,
  alerts: externalAlerts = null, // Allow passing alerts from parent
}) {
  const [alerts, setAlerts] = useState(externalAlerts || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null); // Add debug state
  const [expandedAlerts, setExpandedAlerts] = useState({}); // Track expanded state for each alert

  // Toggle expanded state for an alert
  const toggleAlert = (id) => {
    setExpandedAlerts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Format date from ISO to the required format: 'DD/MM/YYYY, h:mm A'
  const formatDate = (isoDate) => {
    if (!isoDate) return 'Unknown date';
    
    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      
      return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date error';
    }
  };

  // Fetch alerts from Supabase
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching alerts from Supabase...');
      
      // Improved query with better error handling
      const { data, error } = await supabase
        .from('intruder_detection_events')
        .select('*')
        .order('detection_time', { ascending: false })
        .limit(10); // Limit to 10 most recent alerts

      // Store debug info
      setDebugInfo({
        queryTime: new Date().toISOString(),
        dataReceived: !!data,
        recordCount: data?.length || 0,
        error: error?.message,
        firstRecord: data && data.length > 0 ? {...data[0]} : null
      });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('No alerts found in database');
        setAlerts([]);
      } else {
        console.log(`Found ${data.length} alerts in database`);
        
        // Transform data to match the expected format
        const formattedAlerts = data.map(event => {
          // Clean the image URL (remove backticks if present)
          let imageUrl = event.image_url;
          if (imageUrl && imageUrl.includes('`')) {
            imageUrl = imageUrl.replace(/`/g, '').trim();
          }
          
          return {
            title: event.title || 'Intruder Approaching To The Restricted Area',
            date: formatDate(event.detection_time),
            area: event.area || 'Park 1',
            id: event.id,
            image_url: imageUrl,
            distance_cm: event.distance_cm
          };
        });
        
        setAlerts(formattedAlerts);
        setLastFetchTime(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setError(error.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  // Handle new alert from real-time subscription
  const handleNewAlert = (newEvent) => {
    console.log('New alert received:', newEvent);
    
    // Clean the image URL (remove backticks if present)
    let imageUrl = newEvent.image_url;
    if (imageUrl && imageUrl.includes('`')) {
      imageUrl = imageUrl.replace(/`/g, '').trim();
    }
    
    const formattedAlert = {
      title: newEvent.title || 'Intruder Approaching To The Restricted Area',
      date: formatDate(newEvent.detection_time),
      area: newEvent.area || 'Park 1',
      id: newEvent.id,
      image_url: imageUrl,
      distance_cm: newEvent.distance_cm
    };

    // Add the new alert to the beginning of the array
    setAlerts(prevAlerts => {
      // Check if this alert already exists to prevent duplicates
      const exists = prevAlerts.some(alert => alert.id === formattedAlert.id);
      if (exists) return prevAlerts;
      return [formattedAlert, ...prevAlerts];
    });
  };

  // Fetch alerts on component mount and set up real-time subscription
  useEffect(() => {
    console.log('AlertList mounted, fetchFromSupabase:', fetchFromSupabase);
    
    // Only fetch if we're supposed to and don't have external alerts
    if (fetchFromSupabase && !externalAlerts) {
      fetchAlerts();
    } else if (externalAlerts) {
      // If external alerts are provided, use them
      setAlerts(externalAlerts);
      setLoading(false);
    }

    // Set up real-time subscription only if we're fetching from Supabase
    if (fetchFromSupabase) {
      const subscription = supabase
        .channel('intruder-detection-events')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'intruder_detection_events'
          }, 
          (payload) => {
            console.log('Real-time event received:', payload);
            handleNewAlert(payload.new);
          }
        )
        .subscribe();

      console.log('Real-time subscription set up');

      // Cleanup subscription on component unmount
      return () => {
        console.log('Cleaning up subscription');
        subscription.unsubscribe();
      };
    }
  }, [fetchFromSupabase, externalAlerts]);

  return (
    <div className="alert-list">
      <div className="alert-list__header">
        <h2 className="alert-list__title">{title}</h2>
        {linkText && (
          onLinkClick ? (
            <a
              href="#!"
              className="alert-list__link"
              onClick={e => {
                e.preventDefault();
                onLinkClick();
              }}
            >
              {linkText}
            </a>
          ) : (
            <Link to={linkTo} className="alert-list__link">
              {linkText}
            </Link>
          )
        )}
      </div>

      {/* Debug information */}
      <div className="mb-2" style={{ fontSize: '0.8rem' }}>
        <button 
          onClick={fetchAlerts} 
          className="btn btn-sm btn-outline-secondary me-2"
          style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}
        >
          Refresh Alerts
        </button>
        {lastFetchTime && (
          <span className="text-muted me-2">Last fetch: {lastFetchTime}</span>
        )}
        {error && (
          <span className="text-danger">Error: {error}</span>
        )}
      </div>

      {/* Add debug panel */}
      {/*{debugInfo && (
        <div className="alert alert-info mb-2" style={{fontSize: '0.8rem'}}>
          <p className="mb-1"><strong>Debug Info:</strong></p>
          <p className="mb-1">Query time: {new Date(debugInfo.queryTime).toLocaleTimeString()}</p>
          <p className="mb-1">Records found: {debugInfo.recordCount}</p>
          {debugInfo.error && <p className="mb-1 text-danger">Error: {debugInfo.error}</p>}
          {debugInfo.firstRecord && (
            <div>
              <p className="mb-1">First record:</p>
              <pre style={{fontSize: '0.7rem'}}>{JSON.stringify(debugInfo.firstRecord, null, 2)}</pre>
            </div>
          )}
        </div>
      )}*/}

      <div className="alert-list__items" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {loading ? (
          <div className="text-center p-3">Loading alerts...</div>
        ) : error ? (
          <div className="text-center p-3 text-danger">Error: {error}</div>
        ) : alerts.length === 0 ? (
          <div className="text-center p-3">No alerts found</div>
        ) : (
          alerts.map((a, i) => (
            <React.Fragment key={a.id || i}>
              {i > 0 && <hr className="alert-list__divider" />}
              <div className="alert-item">
                <div className="alert-item__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e74c3c" width="24" height="24">
                    <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z"/>
                  </svg>
                </div>
                <div className="alert-item__content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="alert-item__heading">{a.title}</h3>
                    
                    {a.image_url && (
                      <button 
                        onClick={() => toggleAlert(a.id || i)}
                        className="btn btn-sm btn-link p-0"
                        style={{ textDecoration: 'none', color: '#6c757d', marginLeft: '10px', fontSize: '0.8rem' }}
                      >
                        <small>
                          {expandedAlerts[a.id || i] ? 'Hide ▲' : 'Show ▼'}
                        </small>
                      </button>
                    )}
                  </div>
                  
                  <p className="alert-item__meta">
                    {a.date} • {a.area}
                    {a.distance_cm && ` • Distance: ${a.distance_cm}cm`}
                  </p>
                  
                  {a.image_url && expandedAlerts[a.id || i] && (
                    <div className="alert-item__image" style={{ marginTop: '10px' }}>
                      <img 
                        src={a.image_url} 
                        alt="Alert evidence" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '150px', 
                          borderRadius: '4px',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}
