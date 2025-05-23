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
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  
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

  // Reset to first page when search term or records per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, recordsPerPage]);

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

  // ... existing code ...
  
  // Cancel password change
  const cancelPasswordChange = () => {
    setShowPasswordForm(false);
    setPasswordForm({
      userId: '',
      email: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Get filtered users
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get current users for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Previous page
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
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
      
      <div className="container py-5" style={{ minHeight: 'calc(90vh - 160px)' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold mb-0" style={{color: '#4E6E4E'}}>User Accounts</h1>
          <button 
            className="btn btn-success shadow-sm rounded-3"
            onClick={() => setShowNewUserForm(!showNewUserForm)}
          >
            {showNewUserForm ? 'Cancel' : 'Add New User'}
          </button>
        </div>
        
        {/* New User Form */}
        {showNewUserForm && (
          <div className="container mb-4 p-4 bg-light shadow-sm rounded-3 border">
            <h5 className="border-bottom pb-3 mb-3 text-success">Add New User</h5>
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
                    className="btn btn-outline-secondary shadow-sm" 
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
          <div className="container mb-4 p-4 bg-light shadow-sm rounded-3 border">
            <h5 className="border-bottom pb-3 mb-3 text-success">Edit User: {editingUser.email}</h5>
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
                  <button type="submit" className="btn btn-success me-2 shadow-sm" disabled={loading}>
                    {loading ? 'Updating...' : 'Update User'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary shadow-sm" 
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Records per page selector */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="me-2">Show</span>
              <select 
                className="form-select form-select-sm d-inline-block" 
                style={{ width: 'auto' }}
                value={recordsPerPage}
                onChange={(e) => setRecordsPerPage(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="ms-2">entries</span>
            </div>
            <div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mb-4">
          <div className="input-group">
            <span className="input-group-text bg-success text-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Users Table */}
        <div className="table-responsive bg-light rounded-3 shadow-sm">
          <table className="table table-hover mb-0">
            <thead className="bg-success text-white">
              <tr>
                <th width="50">No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="text-center text-danger py-4">
                    Error loading users: {error}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td className="text-center">{indexOfFirstRecord + index + 1}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${
                        user.role === 'admin' ? 'bg-danger' : 
                        user.role === 'controller' ? 'bg-warning text-dark' : 
                        'bg-success'
                      }`}>
                        {user.role === 'parkguide' ? 'Park Guide' : 
                         user.role === 'admin' ? 'Admin' : 
                         'Controller'}
                      </span>
                    </td>
                    <td>{user.createdAt}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-success"
                          onClick={() => startEdit(user)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-outline-danger"
                          onClick={() => deleteUser(user.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                        {/* <button 
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setPasswordForm({
                              userId: user.id,
                              email: user.email,
                              newPassword: '',
                              confirmPassword: ''
                            });
                            setShowPasswordForm(true);
                          }}
                        >
                          <i className="bi bi-key"></i>
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredUsers.length)} of {filteredUsers.length} entries
            </div>
            <div aria-label="User accounts pagination">
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={previousPage}
                    aria-label="Previous"
                    style={{ color: '#4E6E4E', cursor: 'pointer' }}
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </button>
                </li>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    // If 5 or fewer pages, show all
                    pageNum = index + 1;
                  } else if (currentPage <= 3) {
                    // If near start, show first 5 pages
                    pageNum = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // If near end, show last 5 pages
                    pageNum = totalPages - 4 + index;
                  } else {
                    // Otherwise show current page and 2 pages on each side
                    pageNum = currentPage - 2 + index;
                  }
                  
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => paginate(pageNum)}
                        style={{ 
                          backgroundColor: currentPage === pageNum ? '#4E6E4E' : '',
                          borderColor: currentPage === pageNum ? '#4E6E4E' : '',
                          color: currentPage === pageNum ? 'white' : '#4E6E4E',
                          cursor: 'pointer'
                        }}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                })}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={nextPage}
                    aria-label="Next"
                    style={{ color: '#4E6E4E', cursor: 'pointer' }}
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      {/* Password Change Modal */}
      {/* {showPasswordForm && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Change Password for {passwordForm.email}</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowPasswordForm(false)}
                ></button>
              </div>
              <form onSubmit={changePassword}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      required
                    />
                    <div className="form-text">Password must be at least 8 characters long.</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={() => setShowPasswordForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-success" 
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )} */}
      
      <Footer1 />
    </>
  );
};

export default ViewAccounts;
