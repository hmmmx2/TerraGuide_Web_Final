import React from 'react';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Mar 01', Engagement: 400, Sales: 200 },
  { month: 'Apr 01', Engagement: 600, Sales: 350 },
  { month: 'May 01', Engagement: 700, Sales: 500 },
  { month: 'Jun 01', Engagement: 650, Sales: 450 },
  { month: 'Aug 01', Engagement: 600, Sales: 300 },
  { month: 'Sept 01', Engagement: 1000, Sales: 750 },
];

export default function PO() {
  return (
    <div className="d-flex bg-white p-4 w-100 h-100 rounded-4 shadow-sm">
      <h2 className="mb-3 fs-5 fw-semibold">Performance Overview</h2>
      <div style={{ height: 300 }} className="w-100">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" align="right" />
            <Line type="monotone" dataKey="Engagement" stroke="#FBBF24" />
            <Line type="monotone" dataKey="Sales" stroke="#34D399" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}