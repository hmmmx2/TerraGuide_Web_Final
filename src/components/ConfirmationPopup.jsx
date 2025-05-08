import React from 'react';

const ConfirmationPopup = ({ show, onClose, message, title }) => {
  if (!show) return null;

  return (
    <div className="confirmation-popup-overlay">
      <div className="confirmation-popup">
        <div className="confirmation-popup-header">
          <h5>{title || 'Confirmation'}</h5>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>
        <div className="confirmation-popup-body">
          <div className="confirmation-popup-icon">
            <i className="fa-solid fa-envelope-circle-check"></i>
          </div>
          <p>{message}</p>
        </div>
        <div className="confirmation-popup-footer">
          <button type="button" className="confirmation-popup-btn" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;