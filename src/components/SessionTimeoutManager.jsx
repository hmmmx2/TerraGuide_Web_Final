import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../supabase/auth';
import { useAuth } from '../contexts/authContext/supabaseAuthContext';
import SessionWarningModal from './SessionWarningModal';

const SessionTimeoutManager = ({ timeoutDuration = 60000 }) => { // 60000ms = 1 minute
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [warningShown, setWarningShown] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const resetTimer = () => {
    setLastActivity(Date.now());
    setWarningShown(false);
  };

  const handleActivity = () => {
    // Only reset timer if user is not already seeing warning
    // This prevents the warning from disappearing when user moves mouse
    if (!warningShown) {
      resetTimer();
    }
  };

  // Reset timer whenever currentUser changes (login/logout)
  useEffect(() => {
    resetTimer();
  }, [currentUser]);

  useEffect(() => {
    // Only run the timer if the user is logged in
    if (!currentUser) return;

    // Set up event listeners for user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Set up the interval to check for inactivity
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivity;
      const remainingTime = timeoutDuration - timeSinceLastActivity;
      
      setTimeRemaining(remainingTime > 0 ? remainingTime : 0);

      // If 45 seconds have passed (75% of timeout), show warning
      if (timeSinceLastActivity > (timeoutDuration * 0.75) && !warningShown) {
        setWarningShown(true);
      }

      // If timeout duration has passed, log the user out
      if (timeSinceLastActivity > timeoutDuration) {
        console.log('Session timeout - logging out');
        doSignOut().then(() => {
          navigate('/');
        });
      }
    }, 1000); // Check every second for more accurate countdown

    // Clean up event listeners and interval
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(intervalId);
    };
  }, [lastActivity, timeoutDuration, warningShown, navigate, currentUser]);

  return (
    <SessionWarningModal 
      isOpen={warningShown} 
      onContinue={resetTimer} 
      timeRemaining={timeRemaining}
    />
  );
};

export default SessionTimeoutManager;