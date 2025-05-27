import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toast, ToastContainer } from 'react-bootstrap';
import { supabase } from '../supabase/supabase';
import { useAuth } from '../contexts/authContext/supabaseAuthContext';
import AdminTop from '../components/AdminTop';
import Footer1 from '../components/Footer1';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import '../license.css';

export default function LicenseManagement() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [view, setView] = useState('approval');
  const [rows, setRows] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hasChecked, setHasChecked] = useState(false);

  const terraGreen = '#4E6E4E';

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/index');
      return;
    }
    fetchData();
  }, [view, userRole, navigate]);

  useEffect(() => {
    const anyChecked = rows.some(row => row.checked);
    setHasChecked(anyChecked);
  }, [rows]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (view === 'approval') {
        const { data: approvals, error: approvalError } = await supabase
          .from('license_approval')
          .select(`
            id,
            parkguide_id,
            approval_status,
            exam_passed,
            exam_completed_at,
            license_type (id, name),
            license_approval_progress (prerequisite_id, prerequisite_type, status)
          `);
        if (approvalError) throw approvalError;

        console.log('Approvals:', approvals);

        const parkguideIds = approvals.map(a => a.parkguide_id);
        const { data: parkGuides, error: parkGuideError } = await supabase
          .from('park_guides')
          .select(`
            user_id,
            users (id, username)
          `)
          .in('user_id', parkguideIds);
        if (parkGuideError) throw parkGuideError;

        console.log('Park Guides:', parkGuides);

        const userMap = new Map(parkGuides.map(pg => [pg.user_id, pg.users?.username || 'Unknown User']));

        const rows = approvals.map(row => {
          const courseProgress = row.license_approval_progress.filter(p => p.prerequisite_type === 'course');
          const mentorProgress = row.license_approval_progress.filter(p => p.prerequisite_type === 'mentor_program');

          const courseStatus = courseProgress.length === 0 ? 'Not Required' :
            courseProgress.every(p => p.status === 'completed') ? 'Completed' :
            courseProgress.some(p => p.status === 'inprogress') ? 'In Progress' : 'Incomplete';

          const mentorStatus = mentorProgress.length === 0 ? 'Not Required' :
            mentorProgress.every(p => p.status === 'completed') ? 'Completed' :
            mentorProgress.some(p => p.status === 'inprogress') ? 'In Progress' : 'Incomplete';

          return {
            name: userMap.get(row.parkguide_id) || 'Unknown User',
            parkguide_id: row.parkguide_id,
            license_type: row.license_type?.name || 'Unknown License Type',
            course: courseStatus,
            program: mentorStatus,
            exam: row.exam_passed ? 'Passed' : (row.exam_completed_at ? 'Failed' : 'Not Taken'),
            status: row.approval_status,
            approval_id: row.id
          };
        });
        setRows(rows);
      } else {
        const { data: renewals, error: renewalError } = await supabase
          .from('license_renewal')
          .select(`
            id,
            license_id,
            payment_status,
            renewal_status,
            renewal_start_dt,
            renewal_expiry_dt,
            license:license_id (
              id,
              approval_id,
              license_type (id, name)
            )
          `);
        if (renewalError) throw renewalError;

        console.log('Renewals:', renewals);

        if (!renewals || renewals.length === 0) {
          console.log('No renewals found.');
          setRows([]);
          setLoading(false);
          return;
        }

        const approvalIds = renewals
          .filter(r => r.license && r.license.approval_id)
          .map(r => r.license.approval_id);
        console.log('Approval IDs:', approvalIds);

        let approvals = [];
        let approvalMap = new Map();

        if (approvalIds.length > 0) {
          const { data: approvalsData, error: approvalError } = await supabase
            .from('license_approval')
            .select(`
              id,
              parkguide_id
            `)
            .in('id', approvalIds);
          if (approvalError) throw approvalError;

          console.log('Approvals for Renewals:', approvalsData);
          approvals = approvalsData || [];
          approvalMap = new Map(approvals.map(a => [a.id, a.parkguide_id]));
        }

        const parkguideIds = approvals.map(a => a.parkguide_id).filter(id => id);
        console.log('Parkguide IDs:', parkguideIds);

        let userMap = new Map();
        if (parkguideIds.length > 0) {
          const { data: parkGuides, error: parkGuideError } = await supabase
            .from('park_guides')
            .select(`
              user_id,
              users (id, supabase_uid, username)
            `)
            .in('user_id', parkguideIds);
          if (parkGuideError) throw parkGuideError;

          console.log('Park Guides for Renewals:', parkGuides);
          userMap = new Map(parkGuides.map(pg => [pg.user_id, pg.users]));
        }

        const rows = renewals.map(row => {
          const approvalId = row.license?.approval_id || null;
          const parkguideId = approvalId ? approvalMap.get(approvalId) : null;
          const userData = parkguideId ? userMap.get(parkguideId) : null;
          return {
            name: parkguideId ? (userData?.username || 'Unknown User') : 'Unknown User',
            parkguide_id: parkguideId || null,
            supabase_uid: userData?.supabase_uid || null,
            license_type: row.license?.license_type?.name || 'Unknown License Type',
            startDate: row.renewal_start_dt ? new Date(row.renewal_start_dt).toLocaleDateString('en-GB') : 'N/A',
            expiredDate: row.renewal_expiry_dt ? new Date(row.renewal_expiry_dt).toLocaleDateString('en-GB') : 'N/A',
            rawStartDate: row.renewal_start_dt, // Store raw value
            rawExpiryDate: row.renewal_expiry_dt, // Store raw value
            payment: row.payment_status || 'none',
            status: row.renewal_status || 'unknown',
            checked: false,
            renewal_id: row.id,
            license_id: row.license_id
          };
        });
        console.log('Renewal Rows:', rows);
        setRows(rows);
      }
      setToast({ show: true, message: 'Data loaded successfully', variant: 'success' });
    } catch (error) {
      console.error('Error fetching data:', error);
      setToast({ show: true, message: `Failed to load data: ${error.message}`, variant: 'danger' });
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const switchView = newView => {
    setView(newView);
    setDropdownOpen(false);
    setSearchTerm('');
    setEditing(false);
    setCurrentPage(1);
  };

  const handleStatusChange = (i, val) => {
    const updated = [...rows];
    updated[i].status = val;
    setRows(updated);
  };

  const handleCheckChange = (i, checked) => {
    const updated = [...rows];
    updated[i].checked = checked;
    setRows(updated);
  };

  const handleDelete = async (i) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      setLoading(true);
      const row = rows[i];
      if (view === 'approval') {
        const { error } = await supabase
          .from('license_approval')
          .delete()
          .eq('id', row.approval_id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('license_renewal')
          .delete()
          .eq('id', row.renewal_id);
        if (error) throw error;
      }
      const updated = rows.filter((_, index) => index !== i);
      setRows(updated);
      setToast({ show: true, message: 'Record deleted successfully', variant: 'success' });
    } catch (error) {
      console.error('Error deleting record:', error);
      setToast({ show: true, message: `Failed to delete record: ${error.message}`, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      setLoading(true);
      if (view === 'approval') {
        const updates = rows.map(row => ({
          id: row.approval_id,
          approval_status: row.status
        }));
        const { error } = await supabase
          .from('license_approval')
          .upsert(updates, { onConflict: ['id'] });
        if (error) throw error;

        const notifications = rows
          .filter(row => row.status !== 'pending')
          .map(row => ({
            id: crypto.randomUUID(),
            parkguide_id: row.parkguide_id,
            title: `License Approval ${row.status === 'approve' ? 'Approved' : 'Rejected'}`,
            description: `Your license approval for ${row.license_type} has been ${row.status === 'approve' ? 'approved' : 'rejected'}.`,
            created_at: new Date().toISOString(),
            is_read: false,
            notification_type: 'license_renewal',
            related_id: row.approval_id
          }));
        if (notifications.length > 0) {
          const { error: notifyError } = await supabase
            .from('notifications')
            .insert(notifications);
          if (notifyError) throw notifyError;
        }
        setToast({ show: true, message: `Approval statuses updated, ${notifications.length} notification(s) sent`, variant: 'success' });
      } else {
        // Validate that all rows have a license_id and required date fields
        const invalidRows = rows.filter(row => !row.license_id || !row.rawStartDate || !row.rawExpiryDate);
        if (invalidRows.length > 0) {
          console.error('Rows with missing required fields:', invalidRows);
          throw new Error('Some renewal records are missing required fields (license_id, renewal_start_dt, or renewal_expiry_dt)');
        }

        const updates = rows.map(row => ({
          id: row.renewal_id,
          license_id: row.license_id,
          payment_status: row.checked ? 'done' : 'none',
          renewal_status: row.status,
          renewal_start_dt: row.rawStartDate,
          renewal_expiry_dt: row.rawExpiryDate
        }));
        const { error: updateError } = await supabase
          .from('license_renewal')
          .upsert(updates, { onConflict: ['id'] });
        if (updateError) throw updateError;

        const notifications = rows
          .filter(row => row.checked && row.payment === 'done' && row.status === 'renewal required')
          .map(row => ({
            id: crypto.randomUUID(),
            parkguide_id: row.parkguide_id,
            supabase_uid: row.supabase_uid,
            title: 'Reminder: License Renewal Required!',
            description: `Your license (${row.license_type}) renewal is required. Please take action before ${row.expiredDate}.`,
            created_at: new Date().toISOString(),
            is_read: false,
            notification_type: 'license_renewal',
            related_id: row.renewal_id
          }));
        if (notifications.length > 0) {
          const { error: notifyError } = await supabase
            .from('notifications')
            .insert(notifications);
          if (notifyError) throw notifyError;
        }
        setToast({ show: true, message: `Renewal updates sent, ${notifications.length} notification(s) created`, variant: 'success' });
      }
      setEditing(false);
      setRows(rows.map(row => ({ ...row, checked: false })));
    } catch (error) {
      console.error('Error sending changes:', error);
      setToast({ show: true, message: `Failed to send changes: ${error.message}`, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = fullName =>
    fullName
      .split(' ')
      .map(p => p[0])
      .join('')
      .toUpperCase();

  const filteredRows = rows.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.license_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  const goToPage = (page) => setCurrentPage(page >= 1 && page <= totalPages ? page : currentPage);
  const previousPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
  const nextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    if (totalPages > 1) range.push(totalPages);

    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  const title = view === 'approval' ? 'License Approval Management' : 'License Renewal Management';

  return (
    <>
      <div className={editing || dropdownOpen ? 'blur-background' : ''}>
        <AdminTop />
        <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1070 }}>
          <Toast
            show={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
            delay={3000}
            autohide
            bg={toast.variant}
          >
            <Toast.Header closeButton>
              <strong className="me-auto">{toast.variant === 'success' ? 'Success' : 'Error'}</strong>
            </Toast.Header>
            <Toast.Body className={toast.variant === 'success' ? '' : 'text-white'}>
              {toast.message}
            </Toast.Body>
          </Toast>
        </ToastContainer>

        <div className="container py-5" style={{ minHeight: 'calc(90vh - 160px)' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="dropdown position-relative">
              <button
                className="btn btn-outline-primary d-flex align-items-center"
                style={{ borderColor: terraGreen, color: terraGreen }}
                onClick={() => setDropdownOpen(o => !o)}
                disabled={loading}
              >
                {title} <FaChevronDown className={dropdownOpen ? 'ms-2 rotated' : 'ms-2'} />
              </button>
              <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''} w-100 mt-1 border-0 shadow-sm rounded-3`} style={{ zIndex: 1050 }}>
                <li>
                  <a
                    className="dropdown-item py-2 px-4"
                    href="#"
                    onClick={(e) => { e.preventDefault(); switchView('approval'); }}
                    style={{ color: terraGreen }}
                  >
                    License Approval Management
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item py-2 px-4"
                    href="#"
                    onClick={(e) => { e.preventDefault(); switchView('renewal'); }}
                    style={{ color: terraGreen }}
                  >
                    License Renewal Management
                  </a>
                </li>
              </ul>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn text-white rounded-pill px-4 shadow-sm"
                style={{ backgroundColor: terraGreen }}
                onClick={() => setEditing(e => !e)}
                disabled={loading}
              >
                {editing ? 'Cancel Edit' : 'Edit'}
              </button>
              <button
                className="btn text-white rounded-pill px-4 shadow-sm"
                style={{ backgroundColor: terraGreen }}
                onClick={handleSend}
                disabled={loading || !editing || (view === 'renewal' && !hasChecked)}
              >
                Send
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <span className="me-2">Show</span>
              <select
                className="form-select rounded-3 shadow-sm"
                style={{ width: 'auto' }}
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                disabled={loading}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="ms-2">entries</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text rounded-start-3" style={{ backgroundColor: terraGreen, color: 'white' }}>
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control rounded-end-3 shadow-sm"
                placeholder="Search by user name or license type..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="table-responsive bg-light rounded-3 shadow-sm">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: terraGreen, color: 'white' }}>
                <tr>
                  <th>User Name</th>
                  <th>License Type</th>
                  {view === 'approval' ? (
                    <>
                      <th className="text-center">Course</th>
                      <th className="text-center">Mentor Programme</th>
                      <th className="text-center">Exam</th>
                      <th className="text-center">Status</th>
                    </>
                  ) : (
                    <>
                      <th className="text-center">Start Date</th>
                      <th className="text-center">Expired Date</th>
                      <th className="text-center">Payment</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Check</th>
                    </>
                  )}
                  {editing && <th className="text-center" style={{ width: '100px' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={view === 'approval' ? 6 : 7} className="text-center py-4">
                      <div className="spinner-border" style={{ color: terraGreen }} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={view === 'approval' ? 6 : 7} className="text-center py-4">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row, i) => (
                    <tr key={row.approval_id || row.renewal_id}>
                      <td>
                        <div className="d-inline-flex align-items-center">
                          <span
                            className="rounded-circle text-white d-inline-flex align-items-center justify-content-center fw-bold me-3"
                            style={{ width: '3rem', height: '3rem', fontSize: '1rem', backgroundColor: terraGreen }}
                          >
                            {getInitials(row.name)}
                          </span>
                          <Link to="#" className="fw-bold text-reset">
                            {row.name}
                          </Link>
                        </div>
                      </td>
                      <td>{row.license_type}</td>
                      {view === 'approval' ? (
                        <>
                          <td className="text-center">{row.course}</td>
                          <td className="text-center">{row.program}</td>
                          <td className="text-center">{row.exam}</td>
                          <td className="text-center">
                            {editing ? (
                              <select
                                className="form-select rounded-3 shadow-sm"
                                value={row.status}
                                onChange={e => handleStatusChange(i, e.target.value)}
                                disabled={loading}
                              >
                                <option value="approve">Approved</option>
                                <option value="reject">Rejected</option>
                                <option value="pending">Pending</option>
                              </select>
                            ) : (
                              <span
                                className={`badge rounded-pill ${
                                  row.status === 'approve' ? 'bg-success' :
                                  row.status === 'reject' ? 'bg-danger' :
                                  'bg-warning text-dark'
                                }`}
                              >
                                {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                              </span>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="text-center">{row.startDate}</td>
                          <td className="text-center">{row.expiredDate}</td>
                          <td className="text-center">
                            <span
                              className={`badge rounded-pill ${
                                row.payment === 'done' ? 'bg-success' :
                                row.payment === 'inprogress' ? 'bg-info' :
                                row.payment === 'incomplete' ? 'bg-warning text-dark' :
                                'bg-secondary'
                              }`}
                            >
                              {(row.payment || 'none').charAt(0).toUpperCase() + (row.payment || 'none').slice(1)}
                            </span>
                          </td>
                          <td className="text-center">
                            <span
                              className={`badge rounded-pill ${
                                row.status === 'expired' ? 'bg-danger' :
                                row.status === 'no payment' ? 'bg-secondary' :
                                'bg-warning text-dark'
                              }`}
                            >
                              {(row.status || 'unknown').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </span>
                          </td>
                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={row.checked || false}
                              onChange={e => handleCheckChange(i, e.target.checked)}
                              disabled={!editing || !(row.payment === 'done' && row.status === 'renewal required')}
                            />
                          </td>
                        </>
                      )}
                      {editing && (
                        <td className="text-center">
                          <button
                            className="btn btn-outline-danger rounded-pill px-3 shadow-sm"
                            onClick={() => handleDelete(i)}
                            disabled={loading}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && paginatedRows.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <span className="text-muted">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredRows.length)} of {filteredRows.length} entries
              </span>
              <div className="d-flex gap-2" aria-label="License management pagination">
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
                    onClick={() => typeof item === 'number' && goToPage(item)}
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
      </div>
    </>
  );
}