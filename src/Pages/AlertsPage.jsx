// src/pages/AlertsPage.jsx
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AlertList from '../components/AlertList';
import DextIllustration from '../assets/dextai.png';
import '../alertpage.css';
import AdminTop from '../components/AdminTop';
import Footer1 from '../components/Footer1';
import { supabase } from '../supabase/supabase';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch alerts from Supabase
  useEffect(() => {
    fetchAlerts();

    // Set up real-time subscription
    const subscription = supabase
      .channel('intruder-detection-events') // Changed from 'intruder-detection-alerts'
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'intruder_detection_events' // Changed from 'intruder_detection_alerts'
        }, 
        (payload) => {
          handleNewAlert(payload.new);
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Format date from ISO to the required format: 'DD/MM/YYYY, h:mm A'
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    
    return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${ampm}`;
  };

  // Fetch alerts from Supabase
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('intruder_detection_events') // Changed from 'intruder_detection_alerts'
        .select('*')
        .order('detection_time', { ascending: false });

      if (error) throw error;

      // Transform data to match the expected format
      const formattedAlerts = data.map(event => ({
        title: 'Intruder Approaching To The Restricted Area',
        date: formatDate(event.detection_time),
        area: 'Park 1',
        id: event.id,
        image_url: event.image_url,
        distance_cm: event.distance_cm
      }));

      setAlerts(formattedAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle new alert from real-time subscription
  const handleNewAlert = (newEvent) => {
    const formattedAlert = {
      title: 'Intruder Approaching To The Restricted Area',
      date: formatDate(newEvent.detection_time),
      area: 'Park 1',
      id: newEvent.id,
      image_url: newEvent.image_url,
      distance_cm: newEvent.distance_cm
    };

    // Add the new alert to the beginning of the array
    setAlerts(prevAlerts => [formattedAlert, ...prevAlerts]);

    // Show toast notification
    toast.error(
      <div>
        <strong>⚠️ Intruder Detected!</strong>
        <p>Date-time: {formattedAlert.date}</p>
        <p>Area: {formattedAlert.area}</p>
      </div>, 
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      }
    );
  };

  return (
    <>
      <AdminTop/>
      <ToastContainer />
      <div className="alerts-page">
        <div className="alerts-page__hero">
          <img
            src={DextIllustration}
            alt="Dext AI illustration"
            className="alerts-page__hero-image"
          />
        </div>

        <div className="alerts-page__intro">
          <h1 className="alerts-page__title">Intrusion Detection System</h1>
          <p className="alerts-page__description">
            Description:<br></br>

            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.
          </p>
        </div>

        <div className="alerts-page__list" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {loading ? (
            <div className="text-center p-4">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <div className="text-center p-4">No alerts found</div>
          ) : (
            <AlertList
              alerts={alerts}
              title="Alert"
            />
          )}
        </div>
      </div>
      <Footer1/>
    </>
  );
}
