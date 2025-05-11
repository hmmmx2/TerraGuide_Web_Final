// src/components/StatsCard.jsx
import React from 'react';

export default function StatsCard({ examCount = '1,357', bookerCount = '357' }) {
  return (
    <div
      style={{
        background: '#4e6e4e',        // same dark‐green as your example
        borderRadius: '12px',
        padding: '24px',
        width: '450px',
        height:'250px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        color: 'white',
        textAlign: 'center',
        marginLeft: '80px',
      }}
    >
      {/* top metric */}
      <div style={{ marginBottom: '42px' }}>
        <div style={{ fontSize: '2rem', fontWeight: 500 }}>
          {examCount}
        </div>
        <div style={{ fontSize: '0.875rem' }}>
          Exam Takers
        </div>
      </div>

      {/* bottom metric */}
      <div>
        <div style={{ fontSize: '2rem', fontWeight: 500 }}>
          {bookerCount}
        </div>
        <div style={{ fontSize: '0.875rem' }}>
          Bookers
        </div>
      </div>
    </div>
  );
}
