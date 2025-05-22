// src/components/UsersOverviewCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SampleAvatar from '../assets/sample.png';
import '../rmo.css';                    // your global styles
import { supabaseAdmin } from '../supabase/admin-client';

export default function RMO() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the list of users from Supabase Admin API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data: authUsers, error } = await supabaseAdmin.auth.admin.listUsers();
        if (error) throw error;

        // Format into the shape we need
        const formatted = authUsers.users.map((u) => ({
          id: u.id,
          name: `${u.user_metadata?.first_name || ''} ${u.user_metadata?.last_name || ''}`.trim(),
          email: u.email,
          role: u.user_metadata?.role || 'parkguide',
          createdAt: new Date(u.created_at).toLocaleDateString(),
        }));

        setUsers(formatted);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Only show the first six
  const visible = users.slice(0, 6);

  return (
    <div className="bg-white shadow-sm rounded-3 p-4">
      {/* header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Users</h5>
        <Link to="/dashboard/manage-users/view" className="text-primary">All roles</Link>
      </div>

      {loading ? (
        <p className="text-center text-muted">Loading users…</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="fw-bold">User Name</th>
                <th className="fw-bold">Email Address</th>
                <th className="fw-bold">Created</th>
                <th className="fw-bold">Role</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      
                      <span>{u.name || '–'}</span>
                    </div>
                  </td>
                  <td>
                    <a href={`mailto:${u.email}`} className="text-decoration-none">
                      {u.email}
                    </a>
                  </td>
                  <td>{u.createdAt}</td>
                  <td>
                    <span className={`badge rounded-pill ${
                      u.role === 'Admin'       ? 'bg-danger' :
                      u.role === 'Controller'  ? 'bg-warning text-dark' :
                                                 'bg-success'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-3">
                    No users to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
