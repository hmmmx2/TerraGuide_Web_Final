import { useEffect } from 'react';
import { supabase } from '../supabase/supabase';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/authContext/supabaseAuthContext';
import { useLocation } from 'react-router-dom';

const GlobalNotificationListener = () => {
  const { showIntruderAlert } = useNotification();
  const { userRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Only set up the listener if user is admin/controller and on dashboard page
    const isAdmin = userRole === 'admin' || userRole === 'controller';
    const isOnDashboard = location.pathname === '/dashboard';
    
    if (!isAdmin || !isOnDashboard) {
      console.log('Intruder alerts disabled: User not admin or not on dashboard');
      return;
    }

    console.log('Intruder alert notifications activated for admin on dashboard');
    
    // Set up real-time subscription for intruder detection events
    const subscription = supabase
      .channel('global-intruder-events')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'intruder_detection_events'
        }, 
        (payload) => {
          // When a new intruder is detected, show a global notification
          const area = payload.new.area || 'Restricted Area';
          const time = new Date(payload.new.detection_time).toLocaleString();
          
          // Format the alert data to match our enhanced alert format
          const alertData = {
            message: 'Intruder Approaching To The Restricted Area',
            area: area,
            time: time,
            image_url: payload.new.image_url,
            distance_cm: payload.new.distance_cm
          };
          
          // Use the notification context to show a global alert with the enhanced data
          showIntruderAlert(alertData);
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount or when conditions change
    return () => {
      console.log('Cleaning up global notification subscription');
      subscription.unsubscribe();
    };
  }, [showIntruderAlert, userRole, location.pathname]);

  // This component doesn't render anything
  return null;
};

export default GlobalNotificationListener;