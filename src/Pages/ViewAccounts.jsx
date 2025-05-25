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
    password: '',
    bio: '',
    parkArea: 'Park 1',
    workingDays: {
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false
    },
    startTime: '09:00',
    startPeriod: 'AM',
    endTime: '05:00',
    endPeriod: 'PM',
    avatarUrl: null,
    selectedFile: null // For new avatar upload
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

  // Cleanup for avatar preview URL
  useEffect(() => {
    return () => {
      if (editForm.avatarUrl && editForm.selectedFile) {
        URL.revokeObjectURL(editForm.avatarUrl);
      }
    };
  }, [editForm.avatarUrl, editForm.selectedFile]);

  // Fetch all users from Supabase
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (authError) throw authError;
      
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
      
      if (!newUser.email || !newUser.password || !newUser.firstName || !newUser.lastName) {
        showToast('All fields are required', 'danger');
        return;
      }
      
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
      
      await updateRoleTables(data.user.id, newUser.email, newUser.firstName, newUser.lastName, newUser.role, null);
      
      setNewUser({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'parkguide'
      });
      setShowNewUserForm(false);
      
      await fetchUsers();
      
      showToast('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      showToast(`Failed to create user: ${error.message}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Start editing a user
  const startEdit = async (user) => {
    setEditingUser(user);
    setLoading(true);
    
    try {
      let parkGuideData = {};
      if (user.role === 'parkguide') {
        const { data, error } = await supabase
          .from('park_guides')
          .select('*')
          .eq('supabase_uid', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching park guide data:', error);
          showToast('Failed to load park guide details.', 'danger');
        }
        
        parkGuideData = data || {};
      }

      const workingDaysObj = {
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false
      };

      if (parkGuideData.working_days) {
        const days = parkGuideData.working_days.split(',');
        days.forEach(day => {
          const trimmedDay = day.trim();
          if (workingDaysObj.hasOwnProperty(trimmedDay)) {
            workingDaysObj[trimmedDay] = true;
          }
        });
      }

      let startTime = '09:00';
      let endTime = '05:00';
      let startPeriod = 'AM';
      let endPeriod = 'PM';

      if (parkGuideData.working_hours) {
        try {
          const parts = parkGuideData.working_hours.split(' - ');
          if (parts.length === 2) {
            const [start, end] = parts;
            const startParts = start.split(' ');
            if (startParts.length === 2) {
              [startTime, startPeriod] = startParts;
            }
            const endParts = end.split(' ');
            if (endParts.length === 2) {
              [endTime, endPeriod] = endParts;
            }
          }
        } catch (error) {
          console.error('Error parsing working hours:', error);
        }
      }

      setEditForm({
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        password: '',
        bio: parkGuideData.bio || '',
        parkArea: parkGuideData.park_area || 'Park 1',
        workingDays: workingDaysObj,
        startTime,
        startPeriod,
        endTime,
        endPeriod,
        avatarUrl: parkGuideData.avatar_url ? `${parkGuideData.avatar_url}?t=${new Date().getTime()}` : null,
        selectedFile: null
      });
    } catch (error) {
      console.error('Error starting edit:', error);
      showToast('Failed to start editing user.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const objectUrl = URL.createObjectURL(file);
    
    setEditForm(prev => ({
      ...prev,
      selectedFile: file,
      avatarUrl: objectUrl
    }));
  };

  // Handle working day toggle
  const handleDayToggle = (day) => {
    setEditForm(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: !prev.workingDays[day]
      }
    }));
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      firstName: '',
      lastName: '',
      role: '',
      password: '',
      bio: '',
      parkArea: 'Park 1',
      workingDays: {
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false
      },
      startTime: '09:00',
      startPeriod: 'AM',
      endTime: '05:00',
      endPeriod: 'PM',
      avatarUrl: null,
      selectedFile: null
    });
  };

  // Update user
  const updateUser = async (e) => {
    e.preventDefault();
    
    if (!editingUser) return;
    
    try {
      setLoading(true);
      
      let finalAvatarUrl = editForm.avatarUrl;

      if (editForm.selectedFile) {
        const fileExt = editForm.selectedFile.namePLIT('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `parkguides/${editingUser.id}/${fileName}`;

        const { error: uploadError } = await supabase
          .storage
          .from('avatar-images')
          .upload(filePath, editForm.selectedFile, {
            upsert: true
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Avatar upload failed: ${uploadError.message}`);
        }

        const { data: urlData, error: urlError } = await supabase
          .storage
          .from('avatar-images')
          .getPublicUrl(filePath);

        if (urlError) {
          console.error('URL retrieval error:', urlError);
          throw new Error(`Failed to get avatar URL: ${urlError.message}`);
        }

        if (urlData) {
          finalAvatarUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;
          if (editForm.avatarUrl && editForm.selectedFile) {
            URL.revokeObjectURL(editForm.avatarUrl);
          }
        }
      }

      const workingHours = `${editForm.startTime} ${editForm.startPeriod} - ${editForm.endTime} ${editForm.endPeriod}`;
      const workingDays = Object.entries(editForm.workingDays)
        .filter(([_, isSelected]) => isSelected)
        .map(([day]) => day)
        .join(', ');

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        editingUser.id,
        {
          user_metadata: {
            first_name: editForm.firstName,
            last_name: editForm.lastName,
            role: editForm.role
          },
          ...(editForm.password && { password: editForm.password })
        }
      );
      
      if (updateError) throw updateError;

      if (editForm.role === 'parkguide') {
        const { error: parkGuideError } = await supabase
          .from('park_guides')
          .upsert({
            supabase_uid: editingUser.id,
            username: `${editForm.firstName} ${editForm.lastName}`.toLowerCase(),
            bio: editForm.bio,
            park_area: editForm.parkArea,
            working_hours: workingHours,
            working_days: workingDays,
            avatar_url: finalAvatarUrl,
            updated_at: new Date().toISOString()
          }, { onConflict: 'supabase_uid' });

        if (parkGuideError) {
          console.error('Park guide upsert error:', parkGuideError);
          throw parkGuideError;
        }
      }

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
      
      cancelEdit();
      await fetchUsers();
      
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
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('supabase_uid', userId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
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
      
      if (oldRole === 'parkguide') {
        const { error: deleteError } = await supabase
          .from('park_guides')
          .delete()
          .eq('supabase_uid', userId);
        
        if (deleteError) throw deleteError;
      }
      
      if (oldRole === 'admin') {
        const { error: deleteError } = await supabase
          .from('admins')
          .delete()
          .eq('supabase_uid', userId);
        
        if (deleteError) throw deleteError;
      }
      
      if (oldRole === 'controller') {
        const { error: deleteError } = await supabase
          .from('controllers')
          .delete()
          .eq('supabase_uid', userId);
        
        if (deleteError) throw deleteError;
      }
      
      if (newRole === 'parkguide') {
        const { error: insertError } = await supabase
          .from('park_guides')
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
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      if (user.role === 'parkguide') {
        await supabase
          .from('park_guides')
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
      
      await supabase
        .from('users')
        .delete()
        .eq('supabase_uid', userId);
      
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (deleteError) throw deleteError;
      
      await fetchUsers();
      
      showToast('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast(`Failed to delete user: ${error.message}`, 'danger');
    } finally {
      setLoading(false);
    }
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

  // Generate pagination range with ellipses
  const getPaginationRange = () => {
    const delta = 2; // Number of pages to show before and after the current page
    const range = [];
    const rangeWithDots = [];
    let l;

    // Always show the first page
    range.push(1);

    // Calculate the range of pages to display
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Always show the last page if there are more than 1 page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Add ellipses where there are gaps
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const terraGreen = '#4E6E4E';

  return (
    <>
      <AdminTop />
      
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
          <h1 className="fw-bold mb-0" style={{color: terraGreen}}>User Accounts</h1>
          <button 
            className="btn text-white shadow-sm rounded-pill px-4"
            style={{ backgroundColor: terraGreen }}
            onClick={() => setShowNewUserForm(!showNewUserForm)}
          >
            {showNewUserForm ? 'Cancel' : 'Add New User'}
          </button>
        </div>
        
        {showNewUserForm && (
          <div className="container mb-5 p-4 bg-light shadow-sm rounded-3 border">
            <h5 className="border-bottom pb-3 mb-4" style={{ color: terraGreen }}>Add New User</h5>
            <form onSubmit={createUser}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="email"
                      className="form-control rounded-3 bg-light shadow-sm"
                      id="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="Email"
                      required
                    />
                    <label htmlFor="email"><i className="fas fa-envelope me-2" style={{ color: terraGreen }}></i>Email</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="password"
                      className="form-control rounded-3 bg-light shadow-sm"
                      id="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="Password"
                      required
                    />
                    <label htmlFor="password"><i className="fas fa-lock me-2" style={{ color: terraGreen }}></i>Password</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control rounded-3 bg-light shadow-sm"
                      id="firstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      placeholder="First Name"
                      required
                    />
                    <label htmlFor="firstName"><i className="fas fa-user me-2" style={{ color: terraGreen }}></i>First Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control rounded-3 bg-light shadow-sm"
                      id="lastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      placeholder="Last Name"
                      required
                    />
                    <label htmlFor="lastName"><i className="fas fa-user me-2" style={{ color: terraGreen }}></i>Last Name</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating">
                    <select
                      className="form-select rounded-3 bg-light shadow-sm"
                      id="role"
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      required
                    >
                      <option value="parkguide">Park Guide</option>
                      <option value="admin">Admin</option>
                      <option value="controller">Controller</option>
                    </select>
                    <label htmlFor="role"><i className="fas fa-user-tag me-2" style={{ color: terraGreen }}></i>Role</label>
                  </div>
                </div>
                <div className="col-12 mt-4 d-flex">
                  <button 
                    type="submit" 
                    className="btn text-white rounded-pill px-4 me-2 shadow-sm"
                    style={{ backgroundColor: terraGreen }}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create User'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary rounded-pill px-4 shadow-sm" 
                    onClick={() => setShowNewUserForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {editingUser && (
          <div className="container mb-5 p-4 bg-light shadow-sm rounded-3 border">
            <h5 className="border-bottom pb-3 mb-4" style={{ color: terraGreen }}>
              Edit User: {editingUser.email}
            </h5>
            <form onSubmit={updateUser}>
              <div className="row g-4">
                {editForm.role === 'parkguide' && (
                  <div className="col-12 text-center mb-4">
                    <div className="position-relative d-inline-block">
                      <div 
                        className="rounded-circle overflow-hidden shadow-sm border border-3" 
                        style={{ 
                          width: '120px', 
                          height: '120px', 
                          borderColor: terraGreen 
                        }}
                      >
                        <img 
                          src={editForm.avatarUrl || 'https://via.placeholder.com/120'} 
                          className="w-100 h-100" 
                          alt="Profile Picture" 
                          style={{ objectFit: 'cover' }} 
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/120'; }}
                        />
                      </div>
                      <label 
                        htmlFor="avatar-upload" 
                        className="position-absolute bottom-0 end-0 bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center shadow"
                        style={{ 
                          width: '35px', 
                          height: '35px', 
                          cursor: 'pointer', 
                          transform: 'translate(5px, -5px)', 
                          backgroundColor: terraGreen 
                        }}
                      >
                        {loading ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <i className="fas fa-pencil-alt"></i>
                        )}
                        <input 
                          type="file" 
                          id="avatar-upload" 
                          accept="image/*" 
                          className="d-none" 
                          onChange={handleAvatarChange} 
                          disabled={loading}
                        />
                      </label>
                    </div>
                  </div>
                )}
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control rounded-3 bg-light shadow-sm"
                      id="editFirstName"
                      placeholder="First Name"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      required
                    />
                    <label htmlFor="editFirstName"><i className="fas fa-user me-2" style={{ color: terraGreen }}></i>First Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control rounded-3 bg-light shadow-sm"
                      id="editLastName"
                      placeholder="Last Name"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      required
                    />
                    <label htmlFor="editLastName"><i className="fas fa-user me-2" style={{ color: terraGreen }}></i>Last Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <select
                      className="form-select rounded-3 bg-light shadow-sm"
                      id="editRole"
                      value={editForm.role}
                      onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                      required
                    >
                      <option value="parkguide">Park Guide</option>
                      <option value="admin">Admin</option>
                      <option value="controller">Controller</option>
                    </select>
                    <label htmlFor="editRole"><i className="fas fa-user-tag me-2" style={{ color: terraGreen }}></i>Role</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="password"
                      className="form-control rounded-3 bg-light shadow-sm"
                      id="editPassword"
                      placeholder="New Password"
                      value={editForm.password}
                      onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                    />
                    <label htmlFor="editPassword"><i className="fas fa-lock me-2" style={{ color: terraGreen }}></i>New Password (optional)</label>
                  </div>
                </div>
                {editForm.role === 'parkguide' && (
                  <>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control rounded-3 bg-light shadow-sm"
                          id="bio"
                          placeholder="Bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                          style={{ height: '100px' }}
                        />
                        <label htmlFor="bio"><i className="fas fa-comment-alt me-2" style={{ color: terraGreen }}></i>Bio</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <select
                          className="form-select rounded-3 bg-light shadow-sm"
                          id="parkArea"
                          value={editForm.parkArea}
                          onChange={(e) => setEditForm({...editForm, parkArea: e.target.value})}
                        >
                          <option value="Park 1">Park 1</option>
                          <option value="Park 2">Park 2</option>
                          <option value="Park 3">Park 3</option>
                        </select>
                        <label htmlFor="parkArea"><i className="fas fa-map-marker-alt me-2" style={{ color: terraGreen }}></i>Park Area</label>
                      </div>
                    </div>
                    <div className="col-12 p-4 bg-white rounded-3 shadow-sm">
                      <span className="fw-bold mb-3 d-flex align-items-center" style={{ color: terraGreen }}>
                        <i className="fas fa-calendar-day me-2 fs-5"></i>Working Days
                      </span>
                      <div className="d-flex flex-wrap gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                          <button 
                            key={day}
                            type="button" 
                            className={`btn rounded-pill px-4 py-2 ${
                              editForm.workingDays[day] ? 'text-white shadow' : 'bg-white shadow-sm'
                            }`}
                            style={{
                              backgroundColor: editForm.workingDays[day] ? terraGreen : 'white',
                              borderColor: terraGreen,
                              borderWidth: '1px',
                              borderStyle: 'solid'
                            }}
                            onClick={() => handleDayToggle(day)}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="col-12 p-4 bg-white rounded-3 shadow-sm">
                      <span className="fw-bold mb-3 d-flex align-items-center" style={{ color: terraGreen }}>
                        <i className="fas fa-clock me-2 fs-5"></i>Working Hours
                      </span>
                      <div className="row g-3 align-items-center">
                        <div className="col-md-2 col-6">
                          <div className="form-floating">
                            <select
                              className="form-select rounded-3 bg-light"
                              value={editForm.startTime}
                              onChange={(e) => setEditForm({...editForm, startTime: e.target.value})}
                            >
                              {Array.from({ length: 12 }, (_, i) => {
                                const hour = i === 0 ? 12 : i;
                                return (
                                  <option key={`start-${hour}`} value={hour < 10 ? `0${hour}:00` : `${hour}:00`}>
                                    {hour}:00
                                  </option>
                                );
                              })}
                            </select>
                            <label>Start</label>
                          </div>
                        </div>
                        <div className="col-md-2 col-6">
                          <div className="form-floating">
                            <select
                              className="form-select rounded-3 bg-light"
                              value={editForm.startPeriod}
                              onChange={(e) => setEditForm({...editForm, startPeriod: e.target.value})}
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                            <label>Period</label>
                          </div>
                        </div>
                        <div className="col-md-1 col-12 text-center">
                          <span className="fw-medium" style={{ color: terraGreen }}>to</span>
                        </div>
                        <div className="col-md-2 col-6">
                          <div className="form-floating">
                            <select
                              className="form-select rounded-3 bg-light"
                              value={editForm.endTime}
                              onChange={(e) => setEditForm({...editForm, endTime: e.target.value})}
                            >
                              {Array.from({ length: 12 }, (_, i) => {
                                const hour = i === 0 ? 12 : i;
                                return (
                                  <option key={`end-${hour}`} value={hour < 10 ? `0${hour}:00` : `${hour}:00`}>
                                    {hour}:00
                                  </option>
                                );
                              })}
                            </select>
                            <label>End</label>
                          </div>
                        </div>
                        <div className="col-md-2 col-6">
                          <div className="form-floating">
                            <select
                              className="form-select rounded-3 bg-light"
                              value={editForm.endPeriod}
                              onChange={(e) => setEditForm({...editForm, endPeriod: e.target.value})}
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                            <label>Period</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="col-12 d-flex">
                    <button 
                    type="submit" 
                    className="btn text-white rounded-pill px-4 me-2 shadow-sm"
                    style={{ backgroundColor: terraGreen }}
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update User'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary rounded-pill px-4 shadow-sm"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <span className="me-2">Show</span>
            <select 
              className="form-select rounded-3 shadow-sm"
              style={{ width: 'auto' }}
              value={recordsPerPage}
              onChange={(e) => setRecordsPerPage(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="ms-2">entries</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="input-group">
            <span className="input-group-text rounded-start-3" style={{ backgroundColor: terraGreen, color: 'white' }}>
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control rounded-end-3 shadow-sm"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-responsive bg-light rounded-3 shadow-sm">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: terraGreen, color: 'white' }}>
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
                    <div className="spinner-border" style={{ color: terraGreen }} role="status">
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
                      <span className={`badge rounded-pill ${
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
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-success rounded-pill px-3 shadow-sm"
                          onClick={() => startEdit(user)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-outline-danger rounded-pill px-3 shadow-sm"
                          onClick={() => deleteUser(user.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <span className="text-muted">
              Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredUsers.length)} of {filteredUsers.length} entries
            </span>
            <div className="d-flex gap-2" aria-label="User accounts pagination">
              <button
                className={`btn rounded-pill shadow-sm px-3 py-1 ${currentPage === 1 ? 'text-muted' : 'text-dark'}`}
                style={{
                  backgroundColor: currentPage === 1 ? '#e9ecef' : 'white',
                  borderColor: terraGreen,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
                onClick={previousPage}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i> Prev
              </button>
              {getPaginationRange().map((item, index) => (
                <button
                  key={index}
                  className={`btn rounded-pill shadow-sm px-3 py-1 ${
                    item === currentPage ? 'text-white' : item === '...' ? 'text-muted' : 'text-dark'
                  }`}
                  style={{
                    backgroundColor: item === currentPage ? terraGreen : item === '...' ? '#e9ecef' : 'white',
                    borderColor: terraGreen,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    cursor: item === '...' ? 'default' : 'pointer'
                  }}
                  onClick={() => typeof item === 'number' && paginate(item)}
                  disabled={item === '...'}
                >
                  {item}
                </button>
              ))}
              <button
                className={`btn rounded-pill shadow-sm px-3 py-1 ${currentPage === totalPages ? 'text-muted' : 'text-dark'}`}
                style={{
                  backgroundColor: currentPage === totalPages ? '#e9ecef' : 'white',
                  borderColor: terraGreen,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
      
      <Footer1 />
    </>
  );
};

export default ViewAccounts;