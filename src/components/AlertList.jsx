import React from 'react';
import '../alert_list.css';

export default function AlertList({ alerts }) {
  return (
    <div className="alert-list">
      <div className="alert-list__header">
        <h2 className="alert-list__title">Alert</h2>
        <a href="#" className="alert-list__link">All alerts</a>
      </div>
      <div className="alert-list__items">
        {alerts.map((a, i) => (
          <React.Fragment key={i}>
            <div className="alert-item">
              <div className="alert-item__icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M1 21h22L12 2 1 21zM12 16v-4m0 8h.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="alert-item__content">
                <h3 className="alert-item__heading">{a.title}</h3>
                <p className="alert-item__meta">Date-time: {a.date}</p>
                <p className="alert-item__meta">Area: {a.area}</p>
              </div>
            </div>
            {i < alerts.length - 1 && <hr className="alert-list__divider" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
