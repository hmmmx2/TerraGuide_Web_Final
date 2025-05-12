import React from 'react';
import AlertList from './AlertList';
import RMO from './RMO';
import '../rmo_alert.css';

const sampleAlerts = [
  { title: 'Intruder Approaching To The Restricted Area', date: '18/3/2025, 4:00 pm', area: 'Park 1' },
  { title: 'Intruder Approaching To The Restricted Area', date: '18/3/2025, 2:30 pm', area: 'Park 3' },
  { title: 'Intruder Approaching To The Restricted Area', date: '16/3/2025, 1:35 pm', area: 'Park 6' },
  { title: 'Intruder Approaching To The Restricted Area', date: '15/3/2025, 12:03 pm', area: 'Park 4' },
];

export default function RMO_Alert() {
  return (
    <div className="rmo-alert-container">
      <div className="rmo-alert-panel">
        <AlertList alerts={sampleAlerts} />
      </div>
      <div className="rmo-alert-panel">
        <RMO />
      </div>
    </div>
  );
}
