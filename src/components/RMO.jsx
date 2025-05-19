import React from 'react';
import Sample from '../assets/sample.png'; // your avatar

const users = [
  { name: 'Timmy He', email: 'timmyhe@gmail.com', title: 'Senior Manager', role: 'Controller', avatar: Sample },
  { name: 'Jimmy He', email: 'jimmyhe@gmail.com', title: 'Manager',         role: 'Controller', avatar: Sample },
  { name: 'Gimmy He', email: 'gimmyhe@gmail.com', title: 'Business Analyst', role: 'Admin',      avatar: Sample },
];

export default function RMO() {
  return (
    <div className="card">
      <h2>Role Management Overview</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', flexShrink: 0 }}>
        <thead style={{ background: '#EAF5FF' }}>
          <tr>
            <th style={{ padding: '8px' }}>User Name</th>
            <th style={{ padding: '8px' }}>Email Address</th>
            <th style={{ padding: '8px' }}>Designation</th>
            <th style={{ padding: '8px' }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.email} style={{ borderBottom: '1px solid #E2EFEB' }}>
              <td style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={u.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                <span>{u.name}</span>
              </td>
              <td style={{ padding: '8px' }}>
                <a href={`mailto:${u.email}`}>{u.email}</a>
              </td>
              <td style={{ padding: '8px' }}>{u.title}</td>
              <td style={{ padding: '8px' }}>
                <select defaultValue={u.role} style={{ padding: '4px 8px' }}>
                  <option>Admin</option>
                  <option>Controller</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
