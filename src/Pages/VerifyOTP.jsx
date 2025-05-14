import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from "../supabase/supabase";
import Top from "../components/Top";
import Footer1 from "../components/Footer1";
import "../styles.css";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    // Get email from URL params
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // If no email is found, redirect to forgot password page
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    setErrorMessage('');
    setSuccessMessage('');
    
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      setErrorMessage('Please enter all 4 digits of the verification code');
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // Check if OTP exists and is valid
      const { data, error } = await supabase
        .from('password_reset_otps')
        .select('*')
        .eq('email', email)
        .eq('otp', otpCode)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error || !data) {
        throw new Error('Invalid or expired verification code. Please try again.');
      }
      
      // Mark OTP as used
      await supabase
        .from('password_reset_otps')
        .update({ used: true })
        .eq('id', data.id);
      
      // Show success message
      setSuccessMessage('Code verified successfully!');
      
      // Show password reset fields
      setShowPasswordFields(true);
      
      // Disable OTP inputs
      inputRefs.forEach(ref => {
        if (ref.current) ref.current.disabled = true;
      });
      
    } catch (error) {
      setErrorMessage(error.message || 'Failed to verify code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const maxLength = 25;

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (password.length > maxLength) {
      return "Password must be no more than 25 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    setErrorMessage('');
    
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    // Validate password requirements
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }
    
    setIsResetting(true);
    
    try {
      const otpCode = otp.join('');
      
      // Call the update-password Edge Function with OTP
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ 
            email, 
            password: newPassword,
            otp: otpCode 
          })
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }
      
      // Show success message
      setSuccessMessage('Password reset successful! Redirecting to login...');
      
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error resetting password:', error);
      setErrorMessage(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleResendCode = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!email) {
      setErrorMessage('Email address is required');
      return;
    }
    
    try {
      // Generate a new random 4-digit OTP
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Calculate expiration time (2 minutes from now)
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString();
      
      // Store new OTP in Supabase table
      const { error: insertError } = await supabase
        .from('password_reset_otps')
        .insert([
          { email, otp: newOtp, expires_at: expiresAt }
        ]);
      
      if (insertError) throw insertError;
      
      // For development purposes, show the OTP
      console.log('Development mode - New OTP:', newOtp);
      alert(`Development mode: Your new OTP is ${newOtp}`);
      
      setSuccessMessage('A new verification code has been sent to your email');
      
    } catch (error) {
      console.error('Error resending OTP:', error);
      setErrorMessage(error.message || 'Failed to send verification code. Please try again.');
    }
  };

  return (
    <>
      <Top />
      
      <div className="password-reset-container">
        <h2 className="password-reset-title">
          {showPasswordFields ? 'Reset Your Password' : 'Verify Code'}
        </h2>
        
        {!showPasswordFields && (
          <p className="password-reset-message">
            Enter the 4-digit code sent to {email}
          </p>
        )}
        
        {errorMessage && (
          <div className="error-message" style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="success-message" style={{ color: '#4E6E4E', marginBottom: '15px', textAlign: 'center' }}>
            {successMessage}
          </div>
        )}
        
        <form onSubmit={showPasswordFields ? handleResetPassword : handleVerifyOtp} className="password-reset-form">
          {!showPasswordFields ? (
            <>
              <div className="otp-input-group">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otp-input"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              
              <button 
                type="submit" 
                className="password-reset-button" 
                disabled={isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify Code'}
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <button 
                  type="button" 
                  onClick={handleResendCode} 
                  className="resend-code-button"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#4E6E4E', 
                    textDecoration: 'underline', 
                    cursor: 'pointer' 
                  }}
                >
                  Didn't receive a code? Resend
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="password-reset-input-container">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="password-reset-input"
                  placeholder="New Password"
                  required
                />
              </div>
              
              <div className="password-reset-input-container">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="password-reset-input"
                  placeholder="Confirm Password"
                  required
                />
              </div>
              
              <div className="password-reset-message" style={{ textAlign: 'left', fontSize: '0.9rem' }}>
                <p>Password requirements:</p>
                <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                  <li>Minimum 8 characters</li>
                  <li>Maximum 25 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character</li>
                </ul>
              </div>
              
              <button 
                type="submit" 
                className="password-reset-button" 
                disabled={isResetting}
              >
                {isResetting ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </>
          )}
        </form>
        
        <Link to="/" className="back-to-login">Back to Login</Link>
      </div>
      
      <Footer1 />
    </>
  );
};

export default VerifyOTP;