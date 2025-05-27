import React, { useState, useEffect } from 'react'
import { FaSearch, FaChevronDown } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import { Toast, ToastContainer } from 'react-bootstrap';
import { supabase } from '../supabase/supabase';
import { useAuth } from '../contexts/authContext/supabaseAuthContext';
import AdminTop from '../components/AdminTop'
import Footer1 from '../components/Footer1'
import '../styles.css';
import '../database.css'

const SECTIONS = [
  'Learner Enrollment & Progress',
  'Course Performance & Feedback',
  'Periodic Assessment Results',
  'Instructor Activity & Engagement',
  'Subscription & Payment History'
];

export default function Database() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [selected, setSelected] = useState(SECTIONS[4]); // Default to Subscription & Payment History
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [showNewTransactionForm, setShowNewTransactionForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    username: '',
    transaction_type: '',
    amount_rm: '',
    transaction_dt: new Date().toISOString().split('T')[0],
    status: 'pending'
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    transaction_type: '',
    amount_rm: '',
    transaction_dt: '',
    status: 'pending'
  });

  const terraGreen = '#4E6E4E';

  // Show toast notification
  const showToast = (message, variant = 'success') => {
    setToast({ show: true, message, variant });
  };

  // Fetch transactions
  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/index');
      return;
    }
    if (selected === 'Subscription & Payment History') {
      fetchTransactions();
    } else {
      setTransactions([]);
      setError(null);
      setLoading(false);
    }
    setCurrentPage(1);
  }, [selected, userRole, navigate]);

  // Reset to first page when search term or records per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, recordsPerPage]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('transaction_history').select('*');
      if (error) throw error;
      setTransactions(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      showToast('Failed to load transactions. Please try again later.', 'danger');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new transaction
  const createTransaction = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!newTransaction.username || !newTransaction.transaction_type || !newTransaction.amount_rm || !newTransaction.transaction_dt) {
        showToast('All fields are required', 'danger');
        return;
      }
      const { error } = await supabase.from('transaction_history').insert([{
        username: newTransaction.username,
        transaction_type: newTransaction.transaction_type,
        amount_rm: parseFloat(newTransaction.amount_rm),
        transaction_dt: new Date(newTransaction.transaction_dt).toISOString(),
        status: newTransaction.status
      }]);
      if (error) throw error;
      setNewTransaction({
        username: '',
        transaction_type: '',
        amount_rm: '',
        transaction_dt: new Date().toISOString().split('T')[0],
        status: 'pending'
      });
      setShowNewTransactionForm(false);
      await fetchTransactions();
      showToast('Transaction created successfully');
    } catch (error) {
      console.error('Error creating transaction:', error);
      showToast(`Failed to create transaction: ${error.message}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Start editing transaction
  const startEdit = (transaction) => {
    if (selected !== 'Subscription & Payment History') {
      showToast(`Edit functionality for ${selected} is not available.`, 'danger');
      return;
    }
    setEditingTransaction(transaction);
    setEditForm({
      username: transaction.username,
      transaction_type: transaction.transaction_type,
      amount_rm: transaction.amount_rm,
      transaction_dt: new Date(transaction.transaction_dt).toISOString().split('T')[0],
      status: transaction.status
    });
  };

  // Update transaction
  const updateTransaction = async (e) => {
    e.preventDefault();
    if (!editingTransaction) return;
    try {
      setLoading(true);
      const { error } = await supabase
        .from('transaction_history')
        .update({
          username: editForm.username,
          transaction_type: editForm.transaction_type,
          amount_rm: parseFloat(editForm.amount_rm),
          transaction_dt: new Date(editForm.transaction_dt).toISOString(),
          status: editForm.status
        })
        .eq('id', editingTransaction.id);
      if (error) throw error;
      setEditingTransaction(null);
      setEditForm({
        username: '',
        transaction_type: '',
        amount_rm: '',
        transaction_dt: '',
        status: 'pending'
      });
      await fetchTransactions();
      showToast('Transaction updated successfully');
    } catch (error) {
      console.error('Error updating transaction:', error);
      showToast(`Failed to update transaction: ${error.message}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    if (selected !== 'Subscription & Payment History') {
      showToast(`Delete functionality for ${selected} is not available.`, 'danger');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('transaction_history').delete().eq('id', id);
      if (error) throw error;
      await fetchTransactions();
      showToast('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      showToast(`Failed to delete transaction: ${error.message}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingTransaction(null);
    setEditForm({
      username: '',
      transaction_type: '',
      amount_rm: '',
      transaction_dt: '',
      status: 'pending'
    });
  };

  // Filter and paginate transactions
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transaction_type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredTransactions.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const previousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

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

  const isFormOpen = showNewTransactionForm || editingTransaction;

  return (
    <>
      {isFormOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1060,
            animation: 'fadeInBackdrop 0.3s'
          }}
        />
      )}

      <div className={isFormOpen ? 'blur-background' : ''}>
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
          {showNewTransactionForm && (
            <Toast
              show={showNewTransactionForm}
              onClose={() => setShowNewTransactionForm(false)}
              className="position-fixed top-50 start-50 translate-middle p-3 bg-white shadow-lg border-0"
              style={{ minWidth: '400px', maxWidth: '500px', zIndex: 1075, borderRadius: '10px', animation: 'fadeIn 0.3s' }}
            >
              <Toast.Header closeButton closeVariant="white" style={{ backgroundColor: terraGreen, color: 'white', borderRadius: '10px 10px 0 0' }}>
                <strong className="me-auto">Add New Transaction</strong>
              </Toast.Header>
              <Toast.Body className="p-3">
                <form onSubmit={createTransaction}>
                  <div className="row g-2">
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control rounded-3 bg-light shadow-sm"
                          id="username"
                          value={newTransaction.username}
                          onChange={(e) => setNewTransaction({ ...newTransaction, username: e.target.value })}
                          placeholder="Username"
                          required
                        />
                        <label htmlFor="username">
                          <i className="fas fa-user me-2" style={{ color: terraGreen }}></i>Username
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <select
                          className="form-select rounded-3 bg-light shadow-sm"
                          id="transaction_type"
                          value={newTransaction.transaction_type}
                          onChange={(e) => setNewTransaction({ ...newTransaction, transaction_type: e.target.value })}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="Subscription">Subscription</option>
                          <option value="Payment">Payment</option>
                          <option value="Refund">Refund</option>
                        </select>
                        <label htmlFor="transaction_type">
                          <i className="fas fa-exchange-alt me-2" style={{ color: terraGreen }}></i>Transaction Type
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="number"
                          step="0.01"
                          className="form-control rounded-3 bg-light shadow-sm"
                          id="amount_rm"
                          value={newTransaction.amount_rm}
                          onChange={(e) => setNewTransaction({ ...newTransaction, amount_rm: e.target.value })}
                          placeholder="Amount (RM)"
                          required
                        />
                        <label htmlFor="amount_rm">
                          <i className="fas fa-dollar-sign me-2" style={{ color: terraGreen }}></i>Amount (RM)
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="date"
                          className="form-control rounded-3 bg-light shadow-sm"
                          id="transaction_dt"
                          value={newTransaction.transaction_dt}
                          onChange={(e) => setNewTransaction({ ...newTransaction, transaction_dt: e.target.value })}
                          required
                        />
                        <label htmlFor="transaction_dt">
                          <i className="fas fa-calendar-alt me-2" style={{ color: terraGreen }}></i>Transaction Date
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <select
                          className="form-select rounded-3 bg-light shadow-sm"
                          id="status"
                          value={newTransaction.status}
                          onChange={(e) => setNewTransaction({ ...newTransaction, status: e.target.value })}
                          required
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                        </select>
                        <label htmlFor="status">
                          <i className="fas fa-info-circle me-2" style={{ color: terraGreen }}></i>Status
                        </label>
                      </div>
                    </div>
                    <div className="col-12 mt-3 d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn text-white rounded-pill px-4 me-2 shadow-sm"
                        style={{ backgroundColor: terraGreen }}
                        disabled={loading}
                      >
                        {loading ? 'Creating...' : 'Create Transaction'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-pill px-4 shadow-sm"
                        onClick={() => setShowNewTransactionForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </Toast.Body>
            </Toast>
          )}
          {editingTransaction && (
            <Toast
              show={!!editingTransaction}
              onClose={cancelEdit}
              className="position-fixed top-50 start-50 translate-middle p-3 bg-white shadow-lg border-0"
              style={{ minWidth: '400px', maxWidth: '500px', zIndex: 1075, borderRadius: '10px', animation: 'fadeIn 0.3s' }}
            >
              <Toast.Header closeButton closeVariant="white" style={{ backgroundColor: terraGreen, color: 'white', borderRadius: '10px 10px 0 0' }}>
                <strong className="me-auto">Edit Transaction</strong>
              </Toast.Header>
              <Toast.Body className="p-3">
                <form onSubmit={updateTransaction}>
                  <div className="row g-2">
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control rounded-3 bg-light shadow-sm"
                          id="edit_username"
                          value={editForm.username}
                          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                          placeholder="Username"
                          required
                        />
                        <label htmlFor="edit_username">
                          <i className="fas fa-user me-2" style={{ color: terraGreen }}></i>Username
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <select
                          className="form-select rounded-3 bg-light shadow-sm"
                          id="edit_transaction_type"
                          value={editForm.transaction_type}
                          onChange={(e) => setEditForm({ ...editForm, transaction_type: e.target.value })}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="Subscription">Subscription</option>
                          <option value="Payment">Payment</option>
                          <option value="Refund">Refund</option>
                        </select>
                        <label htmlFor="edit_transaction_type">
                          <i className="fas fa-exchange-alt me-2" style={{ color: terraGreen }}></i>Transaction Type
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="number"
                          step="0.01"
                          className="form-control rounded-3 bg-light shadow-sm"
                          id="edit_amount_rm"
                          value={editForm.amount_rm}
                          onChange={(e) => setEditForm({ ...editForm, amount_rm: e.target.value })}
                          placeholder="Amount (RM)"
                          required
                        />
                        <label htmlFor="edit_amount_rm">
                          <i className="fas fa-dollar-sign me-2" style={{ color: terraGreen }}></i>Amount (RM)
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="date"
                          className="form-control rounded-3 bg-light shadow-sm"
                          id="edit_transaction_dt"
                          value={editForm.transaction_dt}
                          onChange={(e) => setEditForm({ ...editForm, transaction_dt: e.target.value })}
                          required
                        />
                        <label htmlFor="edit_transaction_dt">
                          <i className="fas fa-calendar-alt me-2" style={{ color: terraGreen }}></i>Transaction Date
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <select
                          className="form-select rounded-3 bg-light shadow-sm"
                          id="edit_status"
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          required
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                        </select>
                        <label htmlFor="edit_status">
                          <i className="fas fa-info-circle me-2" style={{ color: terraGreen }}></i>Status
                        </label>
                      </div>
                    </div>
                    <div className="col-12 mt-3 d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn text-white rounded-pill px-4 me-2 shadow-sm"
                        style={{ backgroundColor: terraGreen }}
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Update Transaction'}
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
              </Toast.Body>
            </Toast>
          )}
        </ToastContainer>
        <div className="container py-5" style={{ minHeight: 'calc(90vh - 160px)' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="dropdown position-relative">
              <button
                className="btn rounded-pill px-4 shadow-sm"
                style={{ borderColor: terraGreen, color: terraGreen }}
                onClick={() => setOpen(!open)}
              >
                {selected} <FaChevronDown className="ms-2" />
              </button>
              {open && (
                <ul className="dropdown-menu show w-100 mt-1 border-0 shadow-sm rounded-3 animate__animated animate__fadeIn" style={{ zIndex: 1050 }}>
                  {SECTIONS.map((sec) => (
                    <li key={sec}>
                      <a
                        className="dropdown-item py-2 px-4"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelected(sec);
                          setOpen(false);
                        }}
                        style={{ color: terraGreen }}
                      >
                        {sec}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              className="btn text-white rounded-pill px-4 shadow-sm"
              style={{ backgroundColor: terraGreen }}
              onClick={() => selected === 'Subscription & Payment History' ? setShowNewTransactionForm(true) : showToast(`Add functionality for ${selected} is not available.`, 'danger')}
              disabled={selected !== 'Subscription & Payment History'}
            >
              Add New
            </button>
          </div>
          {selected === 'Subscription & Payment History' && (
            <>
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
                    placeholder="Search by username or transaction type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
          <div className="table-responsive bg-light rounded-3 shadow-sm">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: terraGreen, color: 'white' }}>
                <tr>
                  <th width="50">No.</th>
                  <th>Username</th>
                  <th>Transaction Type</th>
                  <th>Amount (RM)</th>
                  <th>Transaction Date</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th width="150">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="spinner-border" style={{ color: terraGreen }} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="text-center text-danger py-4">Error loading transactions: {error}</td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">No transactions found.</td>
                  </tr>
                ) : (
                  currentTransactions.map((transaction, index) => (
                    <tr key={transaction.id}>
                      <td className="text-center">{indexOfFirstRecord + index + 1}</td>
                      <td>{transaction.username}</td>
                      <td>{transaction.transaction_type}</td>
                      <td className="text-end">{transaction.amount_rm.toFixed(2)}</td>
                      <td>{new Date(transaction.transaction_dt).toLocaleString()}</td>
                      <td>{new Date(transaction.created_at).toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            transaction.status === 'completed'
                              ? 'bg-success'
                              : transaction.status === 'failed'
                              ? 'bg-danger'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-success rounded-pill px-3 shadow-sm"
                            onClick={() => startEdit(transaction)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger rounded-pill px-3 shadow-sm"
                            onClick={() => deleteTransaction(transaction.id)}
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
          {selected === 'Subscription & Payment History' && !loading && !error && filteredTransactions.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <span className="text-muted">
                Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredTransactions.length)} of {filteredTransactions.length} entries
              </span>
              <div className="d-flex gap-2" aria-label="Transaction history pagination">
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
      </div>
    </>
  );
}