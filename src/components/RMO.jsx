import React from 'react';
import '../rmo.css';
import SampleAvatar from '../assets/sample.png';  // replace with your real path

const users = [
  { name: 'Timmy He', email: 'timmyhe@gmail.com', title: 'Senior Manager', role: 'Controller', avatar: SampleAvatar },
  { name: 'Jimmy He', email: 'jimmyhe@gmail.com', title: 'Manager', role: 'Controller', avatar: SampleAvatar },
  { name: 'Gimmy He', email: 'gimm yhe@gmail.com', title: 'Business Analyst', role: 'Admin', avatar: SampleAvatar },
  { name: 'Mimmy He', email: 'Mimmyhe@gmail.com', title: 'Business Analyst', role: 'Admin', avatar: SampleAvatar },
  { name: 'Himmy He', email: 'Himmyhe@gmail.com', title: 'Business Analyst', role: 'Admin', avatar: SampleAvatar },
  { name: 'Dimmy He', email: 'Dimmyhe@gmail.com', title: 'Business Analyst', role: 'Admin', avatar: SampleAvatar },
];

export default function RMO() {
  return (
    <div className="rmo-card">
      {/* header bar with title and "All roles" link */}
      <div className="rmo-header-bar">
        <h2 className="rmo-header-title">Users</h2>
        <a href="#" className="rmo-header-link">All roles</a>
      </div>

      {/* column headers */}
      <div className="rmo-row rmo-col-headers">
        <div>User Name</div>
        <div>Email Address</div>
        <div>Designation</div>
        <div>Role</div>
      </div>

      {/* user rows */}
      {users.map(u => (
        <div key={u.email} className="rmo-row">
          <div className="rmo-user-cell">
            <img src={u.avatar} alt={u.name} className="rmo-avatar" />
            <span>{u.name}</span>
          </div>
          <div>
            <a href={`mailto:${u.email}`} className="rmo-email">
              {u.email}
            </a>
          </div>
          <div className="rmo-title">{u.title}</div>
          <div className="rmo-role-cell">
            <div className="rmo-select-wrapper">
              <select defaultValue={u.role} className="rmo-select">
                <option>Admin</option>
                <option>Controller</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}