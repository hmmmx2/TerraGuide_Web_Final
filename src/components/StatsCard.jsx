// src/components/StatsCard.jsx
import React from 'react';

export default function StatsCard({
  examCount = '1,357',
  bookerCount = '357',
}) {
  return (
    <div
      style={{
        background: '#4e6e4e',
        borderRadius: 12,
        padding: '16px 32px',
        width: '100%',
        maxWidth: 900,
        height: 120,            // ↓ shrunk from 200
        marginTop: '24px',      // ↑ added top spacing
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '24px auto 0', // you can also combine vertical margins here
      }}
    >
      {/* metric 1 */}
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 500, lineHeight: 1 }}>
          {examCount}
        </div>
        <div style={{ fontSize: '0.875rem', marginTop: 2 }}>
          Exam Takers
        </div>
      </div>

      {/* divider */}
      <div
        style={{
          width: 1,
          height: '50%',
          background: 'rgba(255,255,255,0.3)',
          margin: '0 24px',
        }}
      />

      {/* metric 2 */}
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 500, lineHeight: 1 }}>
          {bookerCount}
        </div>
        <div style={{ fontSize: '0.875rem', marginTop: 2 }}>
          Bookers
        </div>
      </div>
    </div>
  );
}
