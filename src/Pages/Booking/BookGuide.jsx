import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Top from '../../components/Top';
import Footer1 from '../../components/Footer1';
import { useParkGuideData } from '../../data/parkGuideData';
import { createBooking } from '../../data/bookingData';
import defaultImage from "../../assets/Image.jpg";
import "../../styles.css";

export default function BookGuide() {
  const { guideId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { guides, loading: loadingGuides } = useParkGuideData();
  
  // Get guide from location state or fetch from guides array
  const [guide, setGuide] = useState(location.state?.guide || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    guest_name: '',
    contact_number: '',
    booking_date: '',
    message: ''
  });
  
  // Form validation state
  const [validationErrors, setValidationErrors] = useState({});
  
  // Find guide if not available in location state
  useEffect(() => {
    if (!guide && guides.length > 0) {
      const foundGuide = guides.find(g => g.id === guideId);
      if (foundGuide) {
        setGuide(foundGuide);
      } else {
        setError('Guide not found');
      }
    }
    
    setLoading(loadingGuides);
  }, [guide, guides, guideId, loadingGuides]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.guest_name.trim()) {
      errors.guest_name = 'Name is required';
    }
    
    if (!formData.contact_number.trim()) {
      errors.contact_number = 'Contact number is required';
    } else if (!/^\d{8,15}$/.test(formData.contact_number.replace(/[- ]/g, ''))) {
      errors.contact_number = 'Please enter a valid contact number';
    }
    
    if (!formData.booking_date) {
      errors.booking_date = 'Booking date is required';
    } else {
      const selectedDate = new Date(formData.booking_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.booking_date = 'Booking date cannot be in the past';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Create booking in database
      await createBooking({
        guide_id: guide.id,
        guest_name: formData.guest_name,
        contact_number: formData.contact_number,
        booking_date: formData.booking_date,
        message: formData.message
      });
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        guest_name: '',
        contact_number: '',
        booking_date: '',
        message: ''
      });
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/guide');
      }, 3000);
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Format working days for display
  const formatWorkingDays = (workingDays) => {
    if (!workingDays) return 'Not specified';
    return workingDays.split(',').map(day => day.trim()).join(', ');
  };
  
  if (loading) {
    return (
      <>
        <Top />
        <div className="container my-5 pt-5">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading guide information...</p>
          </div>
        </div>
        <Footer1 />
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Top />
        <div className="container my-5 pt-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <div className="text-center mt-4">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/guide')}
            >
              Back to Guides
            </button>
          </div>
        </div>
        <Footer1 />
      </>
    );
  }
  
  if (!guide) {
    return (
      <>
        <Top />
        <div className="container my-5 pt-5">
          <div className="alert alert-warning" role="alert">
            Guide information not found. Please select a guide from the guides page.
          </div>
          <div className="text-center mt-4">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/guide')}
            >
              Back to Guides
            </button>
          </div>
        </div>
        <Footer1 />
      </>
    );
  }
  
  return (
    <>
      <Top />
      <div className="container my-5 pt-5">
        {success ? (
          <div className="alert alert-success" role="alert">
            <h4 className="alert-heading">Booking Successful!</h4>
            <p>Your booking request has been sent to {guide.username}. They will contact you soon to confirm the details.</p>
            <hr />
            <p className="mb-0">You will be redirected to the guides page shortly...</p>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-lg-5 mb-5">
              <div className="card border-0 shadow" style={{height: "700px"}}>
                <div className="card-img-top overflow-hidden" style={{ height: "350px" }}>
                  <img 
                    src={guide.avatar_url || defaultImage} 
                    alt={guide.username}
                    className="img-fluid w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImage;
                    }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <h2 className="card-title">{guide.username}</h2>
                  <p className="card-text fs-5">{guide.bio || guide.designation}</p>
                  
                  <div className="mt-auto">
                    <h4 className="mb-3">Guide Details</h4>
                    <div className="guide-details-scroll" style={{ maxHeight: "180px", overflowY: "auto", paddingRight: "5px" }}>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between fs-5 py-3">
                          <span>Area:</span>
                          <span className="text-muted">{guide.park_area || 'Not specified'}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between fs-5 py-3">
                          <span>Working Days:</span>
                          <span className="text-muted">{formatWorkingDays(guide.working_days) || 'Not specified'}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between fs-5 py-3">
                          <span>Working Hours:</span>
                          <span className="text-muted">{guide.working_hours || 'Not specified'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-5">
              <div className="card border-0 shadow" style={{height: "700px"}}>
                <div className="card-header bg-success text-white py-4">
                  <h2 className="mb-0 text-center">Book this Guide</h2>
                </div>
                <div className="card-body p-5 d-flex flex-column">
                  <form onSubmit={handleSubmit} className="d-flex flex-column h-100">
                    <div className="mb-4">
                      <label htmlFor="guest_name" className="form-label fs-4 mb-2">Your Name *</label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${validationErrors.guest_name ? 'is-invalid' : ''}`}
                        id="guest_name"
                        name="guest_name"
                        value={formData.guest_name}
                        onChange={handleInputChange}
                        style={{ height: "60px", fontSize: "1.2rem" }}
                        required
                      />
                      {validationErrors.guest_name && (
                        <div className="invalid-feedback fs-5">
                          {validationErrors.guest_name}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="contact_number" className="form-label fs-4 mb-2">Contact Number *</label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${validationErrors.contact_number ? 'is-invalid' : ''}`}
                        id="contact_number"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleInputChange}
                        placeholder="e.g. 0123456789"
                        style={{ height: "60px", fontSize: "1.2rem" }}
                        required
                      />
                      {validationErrors.contact_number && (
                        <div className="invalid-feedback fs-5">
                          {validationErrors.contact_number}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="booking_date" className="form-label fs-4 mb-2">Booking Date *</label>
                      <input
                        type="date"
                        className={`form-control form-control-lg ${validationErrors.booking_date ? 'is-invalid' : ''}`}
                        id="booking_date"
                        name="booking_date"
                        value={formData.booking_date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        style={{ height: "60px", fontSize: "1.2rem" }}
                        required
                      />
                      {validationErrors.booking_date && (
                        <div className="invalid-feedback fs-5">
                          {validationErrors.booking_date}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="message" className="form-label fs-4 mb-2">Message (Optional)</label>
                      <textarea
                        className="form-control form-control-lg"
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Any special requests or information for the guide"
                        style={{ fontSize: "1.2rem" }}
                      ></textarea>
                    </div>
                    
                    <div className="d-grid gap-3 mt-auto">
                      <button
                        type="submit"
                        className="btn btn-success btn-lg py-3 fs-4"
                        disabled={loading}
                        style={{ height: "70px" }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : 'Submit Booking'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg py-3 fs-4"
                        onClick={() => navigate('/guide')}
                        style={{ height: "60px" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer1 />
    </>
  );
} 