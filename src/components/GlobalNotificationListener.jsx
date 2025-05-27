import React, { useEffect } from 'react';
import { useAuth } from '../contexts/authContext/supabaseAuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { supabase } from '../supabase/supabase';
import { useBookingNotifications } from '../data/bookingData';

const GlobalNotificationListener = () => {
  const { currentUser, userRole } = useAuth();
  const { showNotification } = useNotification();
  
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