import React from 'react';
import '../rmo.css';
import SampleAvatar from '../assets/sample.png';  // replace with your real path

const users = [
  { name: 'Timmy He',   email: 'timmyhe@gmail.com',  title: 'Senior Manager',  role: 'Controller', avatar: SampleAvatar },
  { name: 'Jimmy He',   email: 'jimmyhe@gmail.com',  title: 'Manager',         role: 'Controller', avatar: SampleAvatar },
  { name: 'Gimmy He',   email: 'gimmyhe@gmail.com',  title: 'Business Analyst', role: 'Admin',      avatar: SampleAvatar },
  { name: 'Mimmy He',   email: 'Mimmyhe@gmail.com',  title: 'Business Analyst', role: 'Admin',      avatar: SampleAvatar },
  { name: 'Himmy He',   email: 'Himmyhe@gmail.com',  title: 'Business Analyst', role: 'Admin',      avatar: SampleAvatar },
  { name: 'Dimmy He',   email: 'Dimmyhe@gmail.com',  title: 'Business Analyst', role: 'Admin',      avatar: SampleAvatar },
];

export default function RMO() {
  return (
    <div className="rmo-card">
      <table className="rmo-table">
        <thead>
          <tr className="rmo-header">
            <th>User Name</th>
            <th>Email Address</th>
            <th>Designation</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.email}>
              <td className="rmo-user-cell">
                <img src={u.avatar} alt={u.name} className="rmo-avatar" />
                <span>{u.name}</span>
              </td>
              <td>
                <a href={`mailto:${u.email}`} className="rmo-email">
                  {u.email}
                </a>
              </td>
              <td>{u.title}</td>
              <td>
                <div className="rmo-select-wrapper">
                  <select defaultValue={u.role} className="rmo-select">
                    <option>Admin</option>
                    <option>Controller</option>
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


