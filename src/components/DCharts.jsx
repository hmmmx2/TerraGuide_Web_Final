// src/components/DCharts.jsx
import React from 'react';
import PO from './PO';
import PC from './PC';

export default function DCharts() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '100px',                      // still keep your 100px between them
        width: '100%',                     // span the full width of the parent
        padding: '0 100px',                 // small gutter on left/right (adjust as you like)
        boxSizing: 'border-box',           // include padding in that 100% width
        marginTop: '40px',
      }}
    >
      <div style={{ flex: '1 1 0', minWidth: 0 }}>
        <PO />
      </div>

      <div style={{ flex: '1 1 0', minWidth: 0 }}>
        <PC />
      </div>
    </div>
  );
}
