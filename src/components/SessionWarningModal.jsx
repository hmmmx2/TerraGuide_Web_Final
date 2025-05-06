import React, { useEffect } from 'react';
import '../styles.css';

const SessionWarningModal = ({ isOpen, onContinue, timeRemaining }) => {
  // If session has expired (timeRemaining <= 0) or modal is not open, don't render anything
  if (!isOpen || timeRemaining <= 0) return null;

  return (
    <div className="session-warning-overlay">
      <div className="session-warning-modal">
        <div className="session-warning-header">
          <h2>Session Timeout</h2>
        </div>
        <div className="session-warning-body">
          <div className="session-warning-icon">
            <i className="fa-solid fa-clock"></i>
          </div>
          <p>Your session will expire in <span className="session-time-remaining">{Math.ceil(timeRemaining / 1000)}</span> seconds due to inactivity.</p>
          <p>Would you like to continue your session?</p>
        </div>
        <div className="session-warning-footer">
          <button className="session-continue-btn" onClick={onContinue}>
            Continue Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionWarningModal;