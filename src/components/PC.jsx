// src/components/PC.jsx
import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const rawData = [
  { name: 'Rejected', value: 15 },
  { name: 'Pending',  value: 20 },
  { name: 'Approved', value: 70 },
];
const COLORS = ['#FBBF24', '#3B82F6', '#84A98C'];

export default function PC() {
  const total = rawData.reduce((s, e) => s + e.value, 0);
  const approved = rawData.find(e => e.name === 'Approved')?.value || 0;
  const pct = Math.round((approved / total) * 100);

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
      }}
    >
      <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
        Approval Pie Chart
      </h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={rawData}
              dataKey="value"
              innerRadius="60%"
              outerRadius="80%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
            >
              {rawData.map((e,i) => <Cell key={e.name} fill={COLORS[i]} />)}
            </Pie>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="24px" fontWeight="600">
              {pct}%
            </text>
            <Legend verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
