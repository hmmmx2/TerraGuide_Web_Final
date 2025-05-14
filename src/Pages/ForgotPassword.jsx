import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from "../supabase/supabase";
import Top from "../components/Top";
import Footer1 from "../components/Footer1";
import "../styles.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!email) {
      setErrorMessage('Email address is required');
      return;
    }
    
    setIsSending(true);
    
    try {
      // Generate a random 4-digit OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Calculate expiration time (2 minutes from now)
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString();
      
      // Store OTP in Supabase table
      const { error: insertError } = await supabase
        .from('password_reset_otps')
        .insert([
          { email, otp, expires_at: expiresAt }
        ]);
      
      if (insertError) throw insertError;
      
      // Skip the email sending for now
      // const response = await fetch...
      
      // For development purposes, show the OTP
      console.log('Development mode - OTP:', otp);
      alert(`Development mode: Your OTP is ${otp}`);
      
      // Show success message
      setSuccessMessage('Verification code generated. In production, this would be emailed.');
      
      // Redirect to OTP verification page after a delay
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrorMessage(error.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Top />
      
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow">
              <div className="card-body p-4">
                <h2 className="card-title text-center mb-4">Reset Your Password</h2>
                <p className="text-center text-muted mb-4">Enter your email address and we'll send you a verification code.</p>
                
                {errorMessage && (
                  <div className="alert alert-danger text-center mb-4">
                    {errorMessage}
                  </div>
                )}
                
                {successMessage && (
                  <div className="alert alert-success text-center mb-4">
                    {successMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg" 
                      disabled={isSending}
                    >
                      {isSending ? 'Sending...' : 'Send Verification Code'}
                    </button>
                  </div>
                </form>
                
                <div className="text-center mt-3">
                  <Link to="/" className="text-decoration-none">Back to Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer1 />
    </>
  );
};

export default ForgotPassword;