import React from 'react';
import PO from '../components/PO';
import PC from '../components/PC';
import RMO from '../components/RMO';
import AlertList from '../components/AlertList';
import AdminTop from '../components/AdminTop';
import Footer1 from '../components/Footer1';
import '../dashboard.css';

export default function Dashboard() {
  const sampleAlerts = [
    { title: 'Intruder Approaching To The Restricted Area', date: '18/3/2025, 4:00 pm', area: 'Park 1' },
    { title: 'Intruder Approaching To The Restricted Area', date: '18/3/2025, 2:30 pm', area: 'Park 3' },
    { title: 'Intruder Approaching To The Restricted Area', date: '16/3/2025, 1:35 pm', area: 'Park 6' },
    { title: 'Intruder Approaching To The Restricted Area', date: '15/3/2025, 12:03 pm', area: 'Park 4' },
  ];

  return (
    <>
      
      <div className="dashboard-container">
        <PO />
        <PC />
        <RMO />
        <AlertList alerts={sampleAlerts} />
      </div>
      
    </>
  );
}
