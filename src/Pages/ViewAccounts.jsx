import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext/supabaseAuthContext';
import { supabaseAdmin } from '../supabase/admin-client';
import { supabase } from '../supabase/supabase';
import { Toast, ToastContainer } from 'react-bootstrap';
import AdminTop from "../components/AdminTop";
import Footer1 from "../components/Footer1";
import "../styles.css";

const ViewAccounts = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Toast notification state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    variant: 'success'
  });
  
  // New user form state
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'parkguide'
  });
  
  // Edit user form state
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    role: '',
    password: ''
  });

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    userId: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Show toast notification
  const showToast = (message, variant = 'success') => {
    setToast({
      show: true,
      message,
      variant
    });
  };

  // Fetch users on component mount
  useEffect(() => {
    // Check if user has admin privileges
    if (userRole !== 'admin' && userRole !== 'controller') {
      navigate('/index');
      return;
    }
    
    fetchUsers();
  }, [userRole, navigate]);

  // Fetch all users from Supabase
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get users from auth.users
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Format user data
      const formattedUsers = authUsers.users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        role: user.user_metadata?.role || 'parkguide',
        createdAt: new Date(user.created_at).toLocaleDateString()
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Failed to load users. Please try again later.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Create a new user
  const createUser = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate form
      if (!newUser.email || !newUser.password || !newUser.firstName || !newUser.lastName) {
        showToast('All fields are required', 'danger');
        return;
      }
      
      // Create user with Supabase Admin API
      const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true,
        user_metadata: {
          first_name: newUser.firstName,
          last_name: newUser.lastName,
          role: newUser.role
        }
      });
      
      if (createError) throw createError;
      
      // Add user to the appropriate role table
      await updateRoleTables(data.user.id, newUser.email, newUser.firstName, newUser.lastName, newUser.role, null);
      
      // Reset form and refresh user list
      setNewUser({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'parkguide'
      });
      setShowNewUserForm(false);
      
      // Refresh user list
      await fetchUsers();
      
      // Show success message
      showToast('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      showToast(`Failed to create user: ${error.message}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Start editing a user
  const startEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      password: ''
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      firstName: '',
      lastName: '',
      role: '',
      password: ''
    });
  };

  // Update user
  const updateUser = async (e) => {
    e.preventDefault();
    
    if (!editingUser) return;
    
    try {
      setLoading(true);
      
      // Update user metadata
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        editingUser.id,
        {
          user_metadata: {
            first_name: editForm.firstName,
            last_name: editForm.lastName,
            role: editForm.role
          }
        }
      );
      
      if (updateError) throw updateError;
      
      // Update password if provided
      if (editForm.password) {
        const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
          editingUser.id,
          { password: editForm.password }
        );
        
        if (passwordError) throw passwordError;
      }
      
      // Update role tables if role has changed
      if (editForm.role !== editingUser.role) {
        await updateRoleTables(
          editingUser.id, 
          editingUser.email, 
          editForm.firstName, 
          editForm.lastName, 
          editForm.role, 
          editingUser.role
        );
      }
      
      // Reset form and refresh user list
      cancelEdit();
      await fetchUsers();
      
      // Show success message
      showToast('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      showToast(`Failed to update user: ${error.message}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Function to update role-specific tables
  const updateRoleTables = async (userId, email, firstName, lastName, newRole, oldRole) => {
    try {
      // First, ensure user exists in public.users table (common for all users)
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('supabase_uid', userId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        // If error is not "not found", throw it
        throw checkError;
      }
      
      // If user doesn't exist in public.users, add them
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            supabase_uid: userId,
            username: `${firstName}${lastName}`.toLowerCase(),
            email: email,
            role: newRole
          }]);
        
        if (insertError) throw insertError;
      }
      
      // If changing from parkguide role, remove from parkguide table
      if (oldRole === 'parkguide') {
        const { error: deleteError } = await supabase
          .from('park_guides')  // Changed from 'parkguide' to 'park_guides'
          .delete()
          .eq('supabase_uid', userId);
        
        if (deleteError) throw deleteError;
      }
      
      // If changing from admin role, remove from admins table
      if (oldRole === 'admin') {
        const { error: deleteError } = await supabase
          .from('admins')
          .delete()
          .eq('supabase_uid', userId);
        
        if (deleteError) throw deleteError;
      }
      
      // If changing from controller role, remove from controllers table
      if (oldRole === 'controller') {
        const { error: deleteError } = await supabase
          .from('controllers')
          .delete()
          .eq('supabase_uid', userId);
        
        if (deleteError) throw deleteError;
      }
      
      // Add to appropriate role table based on new role
      if (newRole === 'parkguide') {
        const { error: insertError } = await supabase
          .from('park_guides')  // Changed from 'parkguide' to 'park_guides'
          .insert([{
            supabase_uid: userId,
            username: `${firstName}${lastName}`.toLowerCase(),
            park_area: 'Default Area',
            working_hours: '9 AM - 5 PM',
            designation: 'Park Guide',
            bio: ''
          }]);
        
        if (insertError) throw insertError;
      } else if (newRole === 'admin') {
        const { error: insertError } = await supabase
          .from('admins')
          .insert([{
            supabase_uid: userId,
            username: `${firstName}${lastName}`.toLowerCase(),
            designation: 'Administrator'
          }]);
        
        if (insertError) throw insertError;
      } else if (newRole === 'controller') {
        const { error: insertError } = await supabase
          .from('controllers')
          .insert([{
            supabase_uid: userId,
            username: `${firstName}${lastName}`.toLowerCase(),
            designation: 'Controller'
          }]);
        
        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error updating role tables:', error);
      throw new Error(`Failed to update role tables: ${error.message}`);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Get user details before deletion
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Delete from role-specific tables first
      if (user.role === 'parkguide') {
        await supabase
          .from('park_guides')  // Changed from 'parkguide' to 'park_guides'
          .delete()
          .eq('supabase_uid', userId);
      } else if (user.role === 'admin') {
        await supabase
          .from('admins')
          .delete()
          .eq('supabase_uid', userId);
      } else if (user.role === 'controller') {
        await supabase
          .from('controllers')
          .delete()
          .eq('supabase_uid', userId);
      }
      
      // Delete from public.users table
      await supabase
        .from('users')
        .delete()
        .eq('supabase_uid', userId);
      
      // Delete user with Supabase Admin API
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (deleteError) throw deleteError;
      
      // Refresh user list
      await fetchUsers();
      
      // Show success message
      showToast('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast(`Failed to delete user: ${error.message}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate passwords
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        showToast('Passwords do not match', 'danger');
        return;
      }
      
      if (passwordForm.newPassword.length < 8) {
        showToast('Password must be at least 8 characters long', 'danger');
        return;
      }
      
      // Update password with Supabase Admin API
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        passwordForm.userId,
        { password: passwordForm.newPassword }
      );
      
      if (updateError) throw updateError;
      
      // Reset form
      cancelPasswordChange();
      
      // Show success message
      showToast('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      showToast(`Failed to change password: ${error.message}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminTop />
      
      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
        <Toast 
          show={toast.show} 
          onClose={() => setToast({...toast, show: false})} 
          delay={3000} 
          autohide 
          bg={toast.variant}
        >
          <Toast.Header closeButton>
            <strong className="me-auto">
              {toast.variant === 'success' ? 'Success' : 'Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className={toast.variant === 'success' ? '' : 'text-white'}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">User Accounts</h3>
          <button 
            className="btn btn-primary shadow-sm rounded-3"
            onClick={() => setShowNewUserForm(!showNewUserForm)}
          >
            {showNewUserForm ? 'Cancel' : 'Add New User'}
          </button>
        </div>
        
        {/* New User Form */}
        {showNewUserForm && (
          <div className="container mb-4 p-4 bg-white shadow-sm rounded-3 border">
            <h5 className="border-bottom pb-3 mb-3 text-primary">Add New User</h5>
            <form onSubmit={createUser}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="role" className="form-label">Role</label>
                  <select
                    className="form-select"
                    id="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    required
                  >
                    <option value="parkguide">Park Guide</option>
                    <option value="admin">Admin</option>
                    <option value="controller">Controller</option>
                  </select>
                </div>
                <div className="col-12 mt-3">
                  <button type="submit" className="btn btn-success me-2 shadow-sm" disabled={loading}>
                    {loading ? 'Creating...' : 'Create User'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary shadow-sm" 
                    onClick={() => setShowNewUserForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Edit User Form */}
        {editingUser && (
          <div className="container mb-4 p-4 bg-white shadow-sm rounded-3 border">
            <h5 className="border-bottom pb-3 mb-3 text-info">Edit User: {editingUser.email}</h5>
            <form onSubmit={updateUser}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="editFirstName"
                      placeholder="First Name"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      required
                    />
                    <label htmlFor="editFirstName">First Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="editLastName"
                      placeholder="Last Name"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      required
                    />
                    <label htmlFor="editLastName">Last Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <select
                      className="form-select"
                      id="editRole"
                      value={editForm.role}
                      onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                      required
                    >
                      <option value="parkguide">Park Guide</option>
                      <option value="admin">Admin</option>
                      <option value="controller">Controller</option>
                    </select>
                    <label htmlFor="editRole">Role</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="editPassword"
                      placeholder="New Password"
                      value={editForm.password}
                      onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                    />
                    <label htmlFor="editPassword">New Password (leave blank to keep current)</label>
                  </div>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-info text-white me-2 shadow-sm" disabled={loading}>
                    {loading ? 'Updating...' : 'Update User'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary shadow-sm" 
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Users Table */}
        <div className="container p-0">
          <div className="row">
            <div className="col-12">
              <div className="table-responsive shadow-sm rounded-3 border">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 px-4 py-3 text-center fw-bold" style={{ fontWeight: 600 }}>Name</th>
                      <th className="border-0 px-4 py-3 text-center fw-bold" style={{ fontWeight: 600 }}>Email</th>
                      <th className="border-0 px-4 py-3 text-center fw-bold" style={{ fontWeight: 600 }}>Role</th>
                      <th className="border-0 px-4 py-3 text-center fw-bold" style={{ fontWeight: 600 }}>Created</th>
                      <th className="border-0 px-4 py-3 text-center fw-bold" style={{ fontWeight: 600 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && users.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="mt-2 text-muted">Loading users...</p>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-5">
                          <p className="text-muted mb-0">No users found</p>
                        </td>
                      </tr>
                    ) : (
                      users.map(user => (
                        <tr key={user.id}>
                          <td className="px-4 py-3 text-center">
                            <div className="d-flex align-items-center">
                              <div className="avatar-initial rounded-circle bg-light text-primary me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                              </div>
                              <div>
                                <h6 className="mb-0">{user.firstName} {user.lastName}</h6>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">{user.email}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`badge rounded-pill ${
                              user.role === 'admin' ? 'bg-danger' : 
                              user.role === 'controller' ? 'bg-warning text-dark' : 
                              'bg-success'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">{user.createdAt}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="btn-group shadow-sm">
                              <button 
                                className="btn btn-sm btn-outline-primary" 
                                onClick={() => startEdit(user)}
                              >
                                <i className="bi bi-pencil-fill me-1"></i> Edit
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger" 
                                onClick={() => deleteUser(user.id)}
                              >
                                <i className="bi bi-trash-fill me-1"></i> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer1 />
    </>
  );
};

export default ViewAccounts;
