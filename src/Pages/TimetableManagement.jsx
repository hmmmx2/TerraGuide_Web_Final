import React, { useState, useEffect } from 'react';
import AdminTop from '../components/AdminTop';
import Footer1 from '../components/Footer1';
import { useTimetableData, timetableCrud } from '../data/timetableData';
import '../styles.css';

export default function TimetableManagement() {
  // Use the custom hook for timetable data
  const { timetables, loading, error, refetch } = useTimetableData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    time: '',
    title: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Update existing entry
        await timetableCrud.update(editingId, formData);
      } else {
        // Add new entry
        await timetableCrud.create(formData);
      }

      // Reset form
      setFormData({ time: '', title: '', description: '' });
      setIsEditing(false);
      setEditingId(null);
      
      // Refresh data
      refetch();
    } catch (error) {
      console.error('Error saving timetable data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const handleEdit = (timetable) => {
    setIsEditing(true);
    setEditingId(timetable.id);
    setFormData({
      time: timetable.time,
      title: timetable.title,
      description: timetable.description
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this timetable entry?')) {
      return;
    }
    
    try {
      await timetableCrud.delete(id);
      refetch();
    } catch (error) {
      console.error('Error deleting timetable data:', error);
      alert('Error deleting data. Please try again.');
    }
  };

  // Main container style
  const mainContainerStyle = {
    width: '80%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 0'
  };
  
  // Section styles
  const sectionStyle = {
    backgroundColor: '#4E6E4E',
    borderRadius: '15px',
    marginBottom: '40px',
    width: '100%',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
  };
  
  // Header styles
  const headerStyle = {
    backgroundColor: '#00853E',
    color: 'white',
    padding: '20px',
    borderTopLeftRadius: '15px',
    borderTopRightRadius: '15px',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold'
  };
  
  // Form container styles
  const formContainerStyle = {
    padding: '30px'
  };
  
  // Input styles
  const inputStyle = {
    height: '70px', 
    fontSize: '18px',
    padding: '10px 15px',
    marginBottom: '20px',
    width: '100%',
    borderRadius: '8px',
    border: 'none'
  };
  
  // Textarea style
  const textareaStyle = {
    height: '300px',
    fontSize: '18px',
    padding: '15px',
    marginBottom: '20px',
    width: '100%',
    borderRadius: '8px',
    border: 'none'
  };
  
  // Button styles
  const buttonStyle = {
    backgroundColor: '#00853E',
    color: 'white',
    border: 'none',
    padding: '15px 40px',
    fontSize: '18px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginRight: '15px'
  };
  
  const cancelButtonStyle = {
    backgroundColor: '#f8f9fa',
    color: '#333',
    border: 'none',
    padding: '15px 40px',
    fontSize: '18px',
    borderRadius: '8px',
    cursor: 'pointer'
  };
  
  // Table container style
  const tableContainerStyle = {
    maxHeight: '600px',
    overflowY: 'auto',
    backgroundColor: 'white',
    borderBottomLeftRadius: '15px',
    borderBottomRightRadius: '15px'
  };

  const loadingOrErrorMessage = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Loading timetable data...</div>;
    }
    
    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
          <div style={{ color: '#ffcccc', marginBottom: '10px' }}>Error loading timetable data</div>
          <div>{error}</div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      <AdminTop />
      
      <div style={{ backgroundColor: '#f6efdc', minHeight: '100vh', paddingTop: '40px', paddingBottom: '60px' }}>
        <div style={mainContainerStyle}>
          <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '36px', fontWeight: 'bold' }}>
            Timetable Management
          </h1>
          
          {/* Add/Edit Form Section */}
          <div style={sectionStyle}>
            <div style={headerStyle}>
              {isEditing ? 'Edit Timetable Entry' : 'Add New Timetable Entry'}
            </div>
            <div style={formContainerStyle}>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                  <div style={{ flex: '1' }}>
                    <input
                      type="text"
                      name="time"
                      placeholder="Time (e.g., 9:00am)"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ flex: '2' }}>
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  style={textareaStyle}
                />
                <div style={{ textAlign: 'center' }}>
                  <button type="submit" style={buttonStyle}>
                    {isEditing ? 'Update Entry' : 'Add Entry'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      style={cancelButtonStyle}
                      onClick={() => {
                        setIsEditing(false);
                        setEditingId(null);
                        setFormData({ time: '', title: '', description: '' });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Current Timetable Section */}
          <div style={sectionStyle}>
            <div style={headerStyle}>
              Current Timetable
            </div>
            <div style={tableContainerStyle}>
              {loadingOrErrorMessage()}
              
              {!loading && !error && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th style={{ padding: '20px', textAlign: 'left', width: '15%', borderBottom: '1px solid #dee2e6' }}>
                        Time
                      </th>
                      <th style={{ padding: '20px', textAlign: 'left', width: '25%', borderBottom: '1px solid #dee2e6' }}>
                        Title
                      </th>
                      <th style={{ padding: '20px', textAlign: 'left', width: '40%', borderBottom: '1px solid #dee2e6' }}>
                        Description
                      </th>
                      <th style={{ padding: '20px', textAlign: 'center', width: '20%', borderBottom: '1px solid #dee2e6' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetables && timetables.map((timetable) => (
                      <tr key={timetable.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '20px' }}>
                          {timetable.time}
                        </td>
                        <td style={{ padding: '20px' }}>
                          {timetable.title}
                        </td>
                        <td style={{ padding: '20px' }}>
                          {timetable.description}
                        </td>
                        <td style={{ padding: '20px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleEdit(timetable)}
                            style={{
                              backgroundColor: '#007bff',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '5px',
                              marginRight: '10px',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(timetable.id)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer1 />
    </>
  );
} 