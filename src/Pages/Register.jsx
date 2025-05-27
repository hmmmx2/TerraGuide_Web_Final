import React, { useState, useLayoutEffect } from 'react';
import Footer1 from "../components/Footer1";
import Top from "../components/Top";
import "../styles.css";
import registrationImage from "../assets/registrationv2-img.png";
import { useAuth } from "../contexts/authContext/supabaseAuthContext";
import { doCreateUserWithEmailAndPassword } from "../supabase/auth";
import { supabase } from "../supabase/supabase";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

// Terra-Guide theme color
const terraGreen = "#4E6E4E";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userLoggedIn, setEmailVerificationSent, enableGuestMode, setUserLoggedIn } = useAuth();

  // State variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole] = useState("parkguide");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Field error states
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  
  // States for email verification and payment
  const [showEmailVerificationPopup, setShowEmailVerificationPopup] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [pendingTransactionId, setPendingTransactionId] = useState(null);

  // Clear session on component mount to prevent automatic login
  useLayoutEffect(() => {
    const clearSession = async () => {
      await supabase.auth.signOut();
      setUserLoggedIn(false);
    };
    clearSession();
  }, [setUserLoggedIn]);

  // Handle email confirmation redirect after payment
  useLayoutEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');

    const handleConfirmation = async () => {
      if (type === 'email_confirmation') {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user && userData.user.email_confirmed_at) {
          setRegisteredUser(userData.user);
          setFirstName(userData.user.user_metadata.first_name || '');
          setLastName(userData.user.user_metadata.last_name || '');
          setEmail(userData.user.email || '');
          setIsEmailVerified(true);
          setShowEmailVerificationPopup(false);

          // Finalize user setup (upsert park_guides table)
          const updatedUser = userData.user;
          const { data: userRecord, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('supabase_uid', updatedUser.id)
            .single();

          if (userError || !userRecord) {
            console.error('Error fetching user record:', userError);
            setErrorMessage('Failed to fetch user record for park guide association.');
            return;
          }

          const username = `${firstName} ${lastName}`;
          const authId = updatedUser.id;

          // Update the pending transaction with the supabase_uid
          if (pendingTransactionId) {
            const { error: updateError } = await supabase
              .from('transaction_history')
              .update({
                supabase_uid: authId,
                status: 'completed'
              })
              .eq('id', pendingTransactionId);

            if (updateError) {
              console.error('Error updating transaction:', updateError);
              setErrorMessage('Failed to finalize transaction after email confirmation.');
            }
          }

          const { error: parkGuideError } = await supabase
            .from('park_guides')
            .upsert({
              user_id: userRecord.id,
              supabase_uid: authId,
              username: username,
              designation: userRole
            }, { onConflict: 'supabase_uid' });

          if (parkGuideError) {
            console.error('Park guide upsert error:', parkGuideError);
            setErrorMessage(`Failed to save park guide: ${parkGuideError.message}`);
          }

          await supabase.auth.signOut();
          setUserLoggedIn(false);
          navigate('/'); // Redirect to login page after confirmation
        } else {
          setErrorMessage("Email confirmation failed or user not found.");
        }
      }
    };
    handleConfirmation();
  }, [location, setUserLoggedIn, firstName, lastName, userRole, navigate, pendingTransactionId]);

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

  const saveTransaction = async (authId, username) => {
    try {
      if (!username) {
        throw new Error('Username is required');
      }

      const transactionData = {
        supabase_uid: authId || null, // Allow null for pending transactions
        username: username,
        transaction_type: "Registration Fee",
        amount_rm: 100,
        transaction_dt: new Date().toISOString(),
        status: authId ? 'completed' : 'pending'
      };

      const { data, error } = await supabase
        .from('transaction_history')
        .insert(transactionData)
        .select()
        .single();

      if (error) {
        console.error('Error saving transaction:', error);
        throw error;
      }

      return data.id; // Return the transaction ID for later updating
    } catch (error) {
      console.error('Detailed transaction error:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw new Error('Failed to save transaction');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setErrorMessage("");
    
    let hasError = false;

    if (!firstName.trim()) {
      setFirstNameError("First name is required");
      hasError = true;
    }
    
    if (!lastName.trim()) {
      setLastNameError("Last name is required");
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
      hasError = true;
    }
    
    if (hasError) {
      return;
    }

    setIsRegistering(true);

    try {
      const authData = await doCreateUserWithEmailAndPassword(email, password, firstName, lastName, userRole, `${firstName} ${lastName}`);
      if (!authData.user || !authData.user.id) {
        console.warn('User creation initiated, waiting for email confirmation:', authData);
        setRegisteredUser({ id: null, email });
      } else {
        setRegisteredUser(authData.user);
      }
      setShowPaymentPopup(true);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.message.includes("already registered")) {
        setEmailError("This email is already registered. Please use a different email address.");
      } else {
        setErrorMessage(`Error: ${error.message || "Unknown error occurred during registration"}`);
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const proceedToEmailVerification = () => {
    setShowPaymentPopup(false);
    setEmailVerificationSent(true);
    setShowEmailVerificationPopup(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPaymentMethod) {
      setErrorMessage("Please select a payment method");
      return;
    }

    setPaymentStatus("pending");

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentStatus("successful");

      const username = `${firstName} ${lastName}`;
      const authId = registeredUser?.id || null;

      const transactionId = await saveTransaction(authId, username);
      setPendingTransactionId(transactionId);

      // Automatically proceed to email verification after a 2-second delay
      setTimeout(() => {
        proceedToEmailVerification();
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage(`Error: ${error.message || "Unknown error occurred during payment"}`);
      setPaymentStatus("");
    }
  };

  const handleClosePaymentPopup = () => {
    setShowPaymentPopup(false);
    setSelectedPaymentMethod("");
    setPaymentStatus("");
    setErrorMessage("Payment is required to proceed. Please complete the payment.");
  };

  const handleCloseEmailVerificationPopup = () => {
    setShowEmailVerificationPopup(false);
    setIsRegistering(false);
  };

  const handleGuestSignIn = () => {
    setIsRegistering(true);
    setErrorMessage("");
    
    try {
      enableGuestMode();
      setEmailVerificationSent(false);
      navigate('/index');
    } catch (error) {
      console.error("Guest access error:", error);
      setErrorMessage("Failed to enable guest access. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (userLoggedIn && paymentStatus !== "successful" && !isEmailVerified) {
    return <Navigate to="/register" replace />;
  }

  return (
    <>
      <Top />

      <div className="mt-5 registration-height-container">
        <div className="registration-svg-form">
          <div className="registration-svg">
            <div className="registration-svg-container">
              <img
                src={registrationImage}
                className="registration-svg-image"
                alt="Registration"
              />
            </div>
          </div>

          <div className="registration-form">
            <form className="registration-form-body" id="registrationForm" noValidate onSubmit={onSubmit}>
              <div className="registration-input-container">
                <label htmlFor="firstname" className="registration-input-label">First Name:</label>
                <div className={`registration-input-text ${firstNameError ? 'is-invalid' : ''}`}>
                  <span className="registration-icon"><i className="fa-solid fa-user"></i></span>
                  <input
                    type="text"
                    id="firstname"
                    className={`registration-input ${firstNameError ? 'is-invalid' : ''}`}
                    placeholder="E.g. John"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (firstNameError) setFirstNameError("");
                    }}
                    required
                    maxLength="25"
                    pattern="[A-Za-z\s]+"
                    title="Only alphabetical characters allowed (A-Z or a-z)"
                  />
                  {firstNameError && (
                    <div className="invalid-feedback" style={{ display: 'block', color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                      {firstNameError}
                    </div>
                  )}
                </div>
              </div>

              <div className="registration-input-container">
                <label htmlFor="lastname" className="registration-input-label">Last Name:</label>
                <div className={`registration-input-text ${lastNameError ? 'is-invalid' : ''}`}>
                  <span className="registration-icon"><i className="fa-solid fa-user"></i></span>
                  <input
                    type="text"
                    id="lastname"
                    className={`registration-input ${lastNameError ? 'is-invalid' : ''}`}
                    placeholder="E.g. Smith"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (lastNameError) setLastNameError("");
                    }}
                    required
                    maxLength="25"
                    pattern="[A-Za-z\s]+"
                    title="Only alphabetical characters allowed (A-Z or a-z)"
                  />
                  {lastNameError && (
                    <div className="invalid-feedback" style={{ display: 'block', color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                      {lastNameError}
                    </div>
                  )}
                </div>
              </div>

              <div className="registration-input-container">
                <label htmlFor="email" className="registration-input-label">Email Address:</label>
                <div className={`registration-input-text ${emailError ? 'is-invalid' : ''}`}>
                  <span className="registration-icon"><i className="fa-solid fa-envelope"></i></span>
                  <input
                    type="email"
                    id="email"
                    className={`registration-input ${emailError ? 'is-invalid' : ''}`}
                    placeholder="E.g. littlejohnsmith@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    required
                  />
                  {emailError && (
                    <div className="invalid-feedback" style={{ display: 'block', color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                      {emailError}
                    </div>
                  )}
                </div>
              </div>

              <div className="registration-input-container">
                <label htmlFor="password" className="registration-input-label">Password (25 characters max):</label>
                <div className={`registration-input-text ${passwordError ? 'is-invalid' : ''}`} style={{ position: 'relative' }}>
                  <span className="registration-icon"><i className="fa-solid fa-key"></i></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`registration-input ${passwordError ? 'is-invalid' : ''}`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    required
                    minLength="8"
                    maxLength="25"
                  />
                  <span 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      position: 'absolute', 
                      right: '10px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      cursor: 'pointer',
                      zIndex: 10
                    }}
                  >
                    <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </span>
                  {passwordError && (
                    <div className="invalid-feedback" style={{ display: 'block', color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                      {passwordError}
                    </div>
                  )}
                </div>
              </div>

              <div className="registration-input-container">
                <label htmlFor="confirmpassword" className="registration-input-label">Confirm Password:</label>
                <div className={`registration-input-text ${confirmPasswordError ? 'is-invalid' : ''}`} style={{ position: 'relative' }}>
                  <span className="registration-icon"><i className="fa-solid fa-key"></i></span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmpassword"
                    className={`registration-input ${confirmPasswordError ? 'is-invalid' : ''}`}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (confirmPasswordError) setConfirmPasswordError("");
                    }}
                    required
                    minLength="8"
                    maxLength="25"
                  />
                  <span 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ 
                      position: 'absolute', 
                      right: '10px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      cursor: 'pointer',
                      zIndex: 10
                    }}
                  >
                    <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </span>
                  {confirmPasswordError && (
                    <div className="invalid-feedback" style={{ display: 'block', color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                      {confirmPasswordError}
                    </div>
                  )}
                </div>
              </div>

              <hr className="registration-hr" />
              {errorMessage && <p className="registration-passw-requirement" style={{ color: '#dc3545' }}>{errorMessage}</p>}
              <div className="registration-passw-requirement">
                <p>Your password should be difficult to guess and follow these guidelines:</p>
                <ul>
                  <li>Minimum of 8 characters</li>
                  <li>Maximum of 25 characters</li>
                  <li>Must include at least one uppercase letter</li>
                  <li>Must include at least one lowercase letter</li>
                  <li>Must include at least one number (0-9)</li>
                  <li>Must include at least one symbol (e.g., !, @, #, $, etc.)</li>
                </ul>
              </div>

              <button type="submit" className="register-btn" disabled={isRegistering}>
                {isRegistering ? "Registering..." : "Register Now"}
              </button>
              <div className="registration-alry-acc">
                <p className="registration-input-label">Already have an account? <Link to="/" className="registration-custom-login-text">Login</Link></p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
                <p style={{ margin: '0 10px', color: '#F6EFDC' }}>or</p>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
              </div>
              
              <button type="button" className="register-btn bg-light text-success" onClick={handleGuestSignIn}>
                Sign in as Guest
              </button>
            </form>
          </div>
        </div>
      </div>

      {showEmailVerificationPopup && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1050
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#f0f0e8',
            padding: '2rem',
            borderRadius: '15px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
            border: `2px solid ${terraGreen}`
          }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">Verify Your Email</h3>
              <button
                onClick={handleCloseEmailVerificationPopup}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: terraGreen }}
              >
                ×
              </button>
            </div>
            <div className="text-center">
              <p>A confirmation email has been sent to {email}. Please check your inbox (and spam/junk folder) and click the link to verify your account.</p>
              <p>Waiting for verification...</p>
              <div className="spinner-border mt-3" style={{ color: terraGreen }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentPopup && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1050
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#ffffff',
            padding: '2.5rem',
            borderRadius: '20px',
            width: '90%',
            maxWidth: '550px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            border: 'none',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {paymentStatus === "successful" ? (
              <div className="text-center" style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, rgba(78, 110, 78, 0.1), rgba(255, 255, 255, 0))',
                  animation: 'confetti 2s infinite'
                }}></div>
                <div style={{ fontSize: '3rem', color: terraGreen, marginBottom: '1rem' }}>🎉</div>
                <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#333', marginBottom: '0.5rem' }}>
                  Payment Successful!
                </h2>
                <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                  Your registration fee of RM 100 has been processed.
                </p>
                <button
                  className="btn mt-3 px-5 py-3 rounded-full shadow text-white"
                  style={{
                    backgroundColor: terraGreen,
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={proceedToEmailVerification}
                >
                  Proceed to Email Verification
                </button>
                <style>{`
                  @keyframes confetti {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(100%); opacity: 0; }
                  }
                `}</style>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h2 style={{
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: '#333',
                      marginBottom: '0.3rem'
                    }}>
                      Complete Your Payment
                    </h2>
                    <p style={{ color: '#666', fontSize: '1rem' }}>
                      Next step: Verify your email to activate your account.
                    </p>
                  </div>
                  <button
                    onClick={handleClosePaymentPopup}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.8rem',
                      color: '#999',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = terraGreen}
                    onMouseLeave={(e) => e.target.style.color = '#999'}
                  >
                    ×
                  </button>
                </div>
                <div className="mb-4 text-center" style={{
                  backgroundColor: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '10px'
                }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>
                    Registration Fee: <span style={{ color: terraGreen }}>RM 100</span>
                  </p>
                </div>
                <div className="mb-4">
                  <label style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '1rem',
                    display: 'block'
                  }}>
                    Choose a Payment Method
                  </label>
                  <div className="d-flex flex-column gap-3">
                    {['DuitNow', 'PayPal'].map(method => (
                      <button
                        key={method}
                        type="button"
                        className="d-flex align-items-center gap-3 p-3 rounded-lg"
                        style={{
                          backgroundColor: selectedPaymentMethod === method ? '#e8f5e9' : '#f8f9fa',
                          border: `2px solid ${selectedPaymentMethod === method ? terraGreen : '#ddd'}`,
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                        onClick={() => setSelectedPaymentMethod(method)}
                      >
                        <img
                          src={method === 'DuitNow' ? 'https://images.seeklogo.com/logo-png/37/1/duit-now-logo-png_seeklogo-374361.png' : 'https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-150px.png'}
                          alt={`${method} logo`}
                          style={{ width: '30px', height: 'auto' }}
                        />
                        <div className="flex-grow-1 text-left">
                          <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#333', margin: 0 }}>
                            {method} {method === 'DuitNow' ? 'Online Banking' : ''}
                          </p>
                          <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                            Takes a minute
                          </p>
                        </div>
                        {selectedPaymentMethod === method && (
                          <span style={{ color: terraGreen, fontSize: '1.2rem' }}>
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                {errorMessage && (
                  <p style={{ color: '#dc3545', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
                    {errorMessage}
                  </p>
                )}
                <div className="text-center">
                  <button
                    className="btn px-5 py-3 rounded-full shadow text-white"
                    style={{
                      backgroundColor: terraGreen,
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      width: '100%',
                      transition: 'all 0.3s ease',
                      opacity: paymentStatus === "pending" || !selectedPaymentMethod ? 0.6 : 1
                    }}
                    onClick={handlePaymentSubmit}
                    disabled={paymentStatus === "pending" || !selectedPaymentMethod}
                  >
                    {paymentStatus === "pending" ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border spinner-border-sm me-2" style={{ color: '#fff' }} role="status">
                          <span className="visually-hidden">Processing...</span>
                        </div>
                        Processing...
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer1 />
    </>
  );
};

export default Register;