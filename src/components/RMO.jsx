import React from 'react';
import '../rmo.css';    // make sure this path is correct
import Sample from "../assets/sample.png";

export default function RMO() {
  const users = [
    {
      name: 'Timmy He',
      email: 'timmyhe@gmail.com',
      title: 'Senior Manager',
      role: 'Controller',
      avatar: Sample,
    },
    {
      name: 'Jimmy He',
      email: 'jimmyhe@gmail.com',
      title: 'Manager',
      role: 'Controller',
      avatar: Sample,
    },
    {
      name: 'Gimmy He',
      email: 'gimmyhe@gmail.com',
      title: 'Business Analyst',
      role: 'Admin',
      avatar: Sample,
    },
  ];

  return (
    <>
      <div className="dashboard-card">
        <div className="roles-header">
          <h2>Role Management Overview</h2>
        </div>

        <div className="role-table">
          {/* column titles */}
          <div className="titles">
            <div className="col-span-2">User Name</div>
            <div className="col-span-2">Email Address</div>
            <div>Designation</div>
            <div>Role</div>
          </div>

          {/* data rows */}
          {users.map(u => (
            <div className="row" key={u.email}>
              {/* <-- UPDATED user-cell here --> */}
              <div className="col-span-2 user-cell">
                <img src={u.avatar} alt={u.name} />
                <span>{u.name}</span>
              </div>

              <div className="col-span-2">
                <a href={`mailto:${u.email}`}>{u.email}</a>
              </div>
              <div>{u.title}</div>
              <div>
                <select defaultValue={u.role}>
                  <option>{u.role}</option>
                  <option>Admin</option>
                  <option>Controller</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
