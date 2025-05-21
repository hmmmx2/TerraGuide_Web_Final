// src/pages/AlertsPage.jsx
import React, { useState } from 'react';
import AlertList from '../components/AlertList';
import DextIllustration from '../assets/dextai.png';
import '../alertpage.css';

const sampleAlerts = [
  { title: 'Intruder Approaching To The Restricted Area', date: '18/3/2025, 4:00 PM', area: 'Park 1' },
  { title: 'Intruder Approaching To The Restricted Area', date: '17/3/2025, 2:30 PM', area: 'Park 3' },
  { title: 'Intruder Approaching To The Restricted Area', date: '16/3/2025, 1:35 PM', area: 'Park 6' },
  { title: 'Intruder Approaching To The Restricted Area', date: '15/3/2025, 12:03 PM', area: 'Park 4' },
  { title: 'Intruder Approaching To The Restricted Area', date: '14/3/2025, 12:03 PM', area: 'Park 8' },
  { title: 'Intruder Approaching To The Restricted Area', date: '13/3/2025, 12:03 PM', area: 'Park 9' },
  { title: 'Intruder Approaching To The Restricted Area', date: '12/3/2025, 12:03 PM', area: 'Park 5' },
  { title: 'Intruder Approaching To The Restricted Area', date: '11/3/2025, 12:03 PM', area: 'Park 2' },

  // imagine you have more…
];

export default function AlertsPage() {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 4;  // show only first 2 by default

  // choose which alerts to display
  const displayedAlerts = showAll
    ? sampleAlerts
    : sampleAlerts.slice(0, INITIAL_COUNT);

  return (
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.
        </p>
      </div>

      <div className="alerts-page__list">
        <AlertList
          alerts={displayedAlerts}
          title="Alert"
          linkText={showAll ? 'Show Less' : 'See All'}
          onLinkClick={() => setShowAll(prev => !prev)}
        />
      </div>
    </div>
  );
}
