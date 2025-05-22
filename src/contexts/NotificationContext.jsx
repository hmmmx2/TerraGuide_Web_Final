import React, { createContext, useContext, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../supabase/supabase';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
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

  useEffect(() => {
    // Set up real-time subscription for intruder detection events
    const subscription = supabase
      .channel('intruder-detection-events')  // Fixed channel name (was 'intruder-intruder-events')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'intruder_detection_events' 
        }, 
        (payload) => {
          const newEvent = payload.new;
          const formattedDate = formatDate(newEvent.detection_time);
          
          // Show toast notification
          toast.error(
            <div>
              <strong>⚠️ Intruder Detected!</strong>
              <p>Date-time: {formattedDate}</p>
              <p>Area: Park 1</p>
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
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{}}>
      <ToastContainer />
      {children}
    </NotificationContext.Provider>
  );
};