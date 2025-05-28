import React, { useEffect } from 'react';
import { useAuth } from '../contexts/authContext/supabaseAuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { supabase } from '../supabase/supabase';
import { useBookingNotifications } from '../data/bookingData';
import { useLocation } from 'react-router-dom';

const GlobalNotificationListener = () => {
  const { currentUser, userRole } = useAuth();
  const { showNotification, showIntruderAlert } = useNotification();
  const location = useLocation();
  
  // Use the booking notifications hook for park guides
  const { hasNewBookings } = useBookingNotifications(
    userRole === 'parkguide' ? currentUser?.id : null
  );
  
  // Listen for global notifications
  useEffect(() => {
    if (!currentUser) return;
    
    // Set up a channel for global notifications
    const channel = supabase
      .channel('global-notifications')
      .on('broadcast', { event: 'notification' }, (payload) => {
        if (payload.payload) {
          const { message, type, duration } = payload.payload;
          showNotification(message, type || 'info', duration || 5000);
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, showNotification]);
  
  // Listen for intruder detection events - only for admin/controller users
  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) return;
    
    // Check if user is admin or controller - ONLY these roles should see intruder alerts
    const isAdminOrController = userRole === 'admin' || userRole === 'controller';
    if (!isAdminOrController) {
      console.log('Skipping intruder detection subscription: User is not admin/controller');
      return;
    }
    
    // Check if current page is login or register
    const pathname = location.pathname;
    // In HashRouter, the paths are '/' for login and '/signup' for register
    const isLoginOrRegister = pathname === '/' || pathname === '/signup';
    if (isLoginOrRegister) {
      console.log('Skipping intruder detection subscription: User is on login/register page');
      return;
    }
    
    console.log('Setting up intruder detection subscription for admin/controller user');
    
    // Set up a subscription to intruder_detection_events table
    const subscription = supabase
      .channel('intruder-detection-events')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'intruder_detection_events'
        }, 
        (payload) => {
          console.log('Intruder detection event received:', payload);
          
          // Format the alert data
          const alertData = {
            message: payload.new.title || 'Intruder Approaching To The Restricted Area',
            area: payload.new.area || 'Park 1',
            time: new Date(payload.new.detection_time).toLocaleString(),
            image_url: payload.new.image_url,
            distance_cm: payload.new.distance_cm
          };
          
          // Show the intruder alert notification
          showIntruderAlert(alertData);
        }
      )
      .subscribe();
    
    console.log('Intruder detection subscription set up');
    
    // Cleanup subscription on component unmount or when conditions change
    return () => {
      console.log('Cleaning up intruder detection subscription');
      subscription.unsubscribe();
    };
  }, [currentUser, userRole, location.pathname, showIntruderAlert]);
  
  // Show notification for new bookings
  useEffect(() => {
    if (hasNewBookings) {
      showNotification(
        'You have new booking requests! Check your bookings page.',
        'info',
        10000
      );
    }
  }, [hasNewBookings, showNotification]);
  
  return null; // This component doesn't render anything
};

export default GlobalNotificationListener;