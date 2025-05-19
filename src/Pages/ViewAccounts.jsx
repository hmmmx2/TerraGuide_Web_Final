import React, { useState, useEffect } from 'react';
import AdminTop from '../components/AdminTop';
import Footer1 from '../components/Footer1';
import { supabase } from '../supabase/supabase';
import { Toast, ToastContainer, Modal, Button, Form } from 'react-bootstrap';

export default function ViewAccounts() {
  const [parkGuides, setParkGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });

  const fetchParkGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      const from = (currentPage - 1) * recordsPerPage;
      const to = from + recordsPerPage - 1;

      const { count, error: countError } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .eq('role', 'parkguide');

      if (countError) throw countError;
      setTotalRecords(count || 0);

      const { data, error } = await supabase
        .from('users')
        .select('id, supabase_uid, username, email, role, created_at')
        .eq('role', 'parkguide')
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParkGuides(data || []);
    } catch (err) {
      console.error('Error fetching park guides:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkGuides();
  }, [currentPage, recordsPerPage]);

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle create account
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      showToastMessage('Passwords do not match', 'danger');
      return;
    }
    
    try {
      // First check if email already exists in auth.users
      const { data: existingUser, error: checkError } = await supabase.auth.admin.listUsers({
        filter: `email.ilike.${formData.email}`
      });
      
      if (checkError) throw checkError;
      
      // Check if user with this email already exists
      if (existingUser && existingUser.users && existingUser.users.length > 0) {
        showToastMessage('A user with this email already exists', 'danger');
        return;
      }
      
      // Create user in Supabase Auth with additional metadata and auto-verification
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true, // Auto-verify the email
        user_metadata: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: 'parkguide',
          full_name: `${formData.firstName} ${formData.lastName}`
        }
      });
      
      if (authError) throw authError;
      
      // The users and park_guides tables will be populated automatically by database triggers
      // We don't need to manually insert into these tables anymore
      
      // Success
      showToastMessage('Account created successfully', 'success');
      setShowCreateModal(false);
      resetForm();
      fetchParkGuides();
      
    } catch (err) {
      console.error('Error creating account:', err);
      showToastMessage(`Error: ${err.message}`, 'danger');
    }
  };

  // Handle update account
  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    
    try {
      // Update username in users table
      const { error: dbError } = await supabase
        .from('users')
        .update({
          username: formData.username
        })
        .eq('id', selectedUser.id);
      
      if (dbError) throw dbError;
      
      // Update password if provided
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          showToastMessage('Passwords do not match', 'danger');
          return;
        }
        
        // Update password in Supabase Auth
        const { error: authError } = await supabase.auth.admin.updateUserById(
          selectedUser.supabase_uid,
          { password: formData.password }
        );
        
        if (authError) throw authError;
      }
      
      // Success
      showToastMessage('Account updated successfully', 'success');
      setShowUpdateModal(false);
      resetForm();
      fetchParkGuides();
      
    } catch (err) {
      console.error('Error updating account:', err);
      showToastMessage(`Error: ${err.message}`, 'danger');
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    try {
      // Delete from users table
      const { error: dbError } = await supabase
        .from('users')
        .delete()
        .eq('id', selectedUser.id);
      
      if (dbError) throw dbError;
      
      // Delete from Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(
        selectedUser.supabase_uid
      );
      
      if (authError) throw authError;
      
      // Success
      showToastMessage('Account deleted successfully', 'success');
      setShowDeleteModal(false);
      fetchParkGuides();
      
    } catch (err) {
      console.error('Error deleting account:', err);
      showToastMessage(`Error: ${err.message}`, 'danger');
    }
  };

  // Show toast message
  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      username: ''
    });
  };

  // Open update modal
  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setFormData({
      ...formData,
      username: user.username,
      email: user.email
    });
    setShowUpdateModal(true);
  };

  // Open delete modal
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  return (
    <>
      <AdminTop />

      <div className="container justify-content-center mt-5 py-4">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12 text-white">
            <div className="p-4 rounded shadow-sm" style={{backgroundColor: '#4E6E4E'}}>
              <div className="d-flex justify-content-between align-items-center">
                <div className='me-4'>
                  <h2 className="fw-bold">Park Guide Accounts</h2>
                  <p className="mb-0">Browse and manage park guide accounts from the system.</p>
                </div>
                <button 
                  className="btn btn-light" 
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="bg-white p-3 rounded shadow-sm" style={{borderLeft: '4px solid #4E6E4E'}}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <h5 className="mb-2 mb-md-0" style={{color: '#4E6E4E'}}>Park Guides List</h5>
                <div className="d-flex gap-2 align-items-center">
                  <label htmlFor="recordsPerPage" className="form-label me-2 mb-0">Show</label>
                  <select
                    id="recordsPerPage"
                    className="form-select form-select-sm"
                    value={recordsPerPage}
                    onChange={(e) => {
                      setRecordsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    {[5, 10, 25, 50].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <button 
                    className="btn btn-sm ms-2" 
                    style={{backgroundColor: '#4E6E4E', color: 'white'}}
                    onClick={fetchParkGuides}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="row">
          <div className="col-12">
            {loading ? (
              <div className="bg-white p-5 text-center rounded shadow-sm">
                <div className="spinner-border" role="status" style={{color: '#4E6E4E'}} />
                <p className="mt-3">Loading park guides...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">Error: {error}</div>
            ) : parkGuides.length === 0 ? (
              <div className="bg-white p-5 text-center rounded shadow-sm">
                <p>No park guides found.</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded shadow-sm overflow-hidden">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead style={{backgroundColor: '#E8F0E8'}}>
                        <tr>
                          <th className="p-3" style={{borderBottom: '2px solid #4E6E4E'}}>ID</th>
                          <th className="p-3" style={{borderBottom: '2px solid #4E6E4E'}}>Supabase UID</th>
                          <th className="p-3" style={{borderBottom: '2px solid #4E6E4E'}}>Username</th>
                          <th className="p-3" style={{borderBottom: '2px solid #4E6E4E'}}>Email</th>
                          <th className="p-3" style={{borderBottom: '2px solid #4E6E4E'}}>Role</th>
                          <th className="p-3" style={{borderBottom: '2px solid #4E6E4E'}}>Created At</th>
                          <th className="p-3 text-center" style={{borderBottom: '2px solid #4E6E4E'}}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parkGuides.map((guide, index) => (
                          <tr key={guide.id} style={{backgroundColor: index % 2 === 0 ? 'white' : '#F8FAF8'}}>
                            <td className="p-3">{guide.id}</td>
                            <td className="p-3">{guide.supabase_uid}</td>
                            <td className="p-3 fw-medium">{guide.username}</td>
                            <td className="p-3">{guide.email}</td>
                            <td className="p-3">
                              <span className="badge rounded-pill px-3 py-2" style={{backgroundColor: '#4E6E4E'}}>{guide.role}</span>
                            </td>
                            <td className="p-3">{new Date(guide.created_at).toLocaleString()}</td>
                            <td className="p-3 text-center">
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-warning me-2" 
                                  onClick={() => openUpdateModal(guide)}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger" 
                                  onClick={() => openDeleteModal(guide)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination Section */}
                <div className="bg-white p-3 rounded shadow-sm mt-3 mb-5" style={{borderTop: '3px solid #4E6E4E'}}>
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <small className="text-muted mb-2 mb-md-0">
                      Showing {(currentPage - 1) * recordsPerPage + 1} to{" "}
                      {Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords} entries
                    </small>
                    <div>
                      <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" 
                            onClick={() => setCurrentPage(currentPage - 1)}
                            style={{color: '#4E6E4E', borderColor: '#dee2e6'}}>
                            Previous
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1;
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                <button 
                                  className="page-link" 
                                  onClick={() => setCurrentPage(page)}
                                  style={page === currentPage ? 
                                    {backgroundColor: '#4E6E4E', borderColor: '#4E6E4E', color: 'white'} : 
                                    {color: '#4E6E4E', borderColor: '#dee2e6'}}>
                                  {page}
                                </button>
                              </li>
                            );
                          } else if (
                            (page === currentPage - 2 && currentPage > 3) ||
                            (page === currentPage + 2 && currentPage < totalPages - 2)
                          ) {
                            return (
                              <li key={page} className="page-item disabled">
                                <span className="page-link" style={{borderColor: '#dee2e6'}}>...</span>
                              </li>
                            );
                          }
                          return null;
                        })}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => setCurrentPage(currentPage + 1)}
                            style={{color: '#4E6E4E', borderColor: '#dee2e6'}}>
                            Next
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Create Account Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton style={{backgroundColor: '#E8F0E8'}}>
          <Modal.Title>Create Park Guide Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateAccount}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button type="reset" variant="outline-secondary" onClick={resetForm}>
                Reset
              </Button>
              <Button type="submit" style={{backgroundColor: '#4E6E4E', borderColor: '#4E6E4E'}}>
                Create Account
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Update Account Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
        <Modal.Header closeButton style={{backgroundColor: '#E8F0E8'}}>
          <Modal.Title>Update Park Guide Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateAccount}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                disabled 
              />
              <Form.Text className="text-muted">
                Email cannot be changed.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password (leave blank to keep current)</Form.Label>
              <Form.Control 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => {
                setShowUpdateModal(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button type="submit" style={{backgroundColor: '#4E6E4E', borderColor: '#4E6E4E'}}>
                Update Account
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the account for <strong>{selectedUser?.username}</strong>?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1060 }}>
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={5000} 
          autohide 
          bg={toastType}
        >
          <Toast.Header closeButton>
            <strong className="me-auto">
              {toastType === 'success' ? 'Success' : 'Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastType === 'success' ? '' : 'text-white'}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Footer1 />
    </>
  );
}
