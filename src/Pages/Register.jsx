import React, { useState } from 'react'
import Footer1 from "../components/Footer1";
import Top from "../components/Top";
import "../styles.css";
import registrationImage from "../assets/registrationv2-img.png";
// Updated to use Supabase authentication
import { useAuth } from "../contexts/authContext/supabaseAuthContext";
import { doCreateUserWithEmailAndPassword } from "../supabase/auth";
import { supabase } from "../supabase/supabase"; // Add this import
import { Link, Navigate, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique guest IDs
import ConfirmationPopup from "../components/ConfirmationPopup"; // Import the popup component

const Register = () => {
  const navigate = useNavigate();
  const { userLoggedIn, setEmailVerificationSent, enableGuestMode } = useAuth();

  // Existing state variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Changed: Set default role to "parkguide" without selection option
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
  // Removed userRoleError since we no longer need it
  const [userRoleError, setUserRoleError] = useState("");
  
  // Add state for the confirmation popup
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Reset all error states
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setErrorMessage("");
    
    let hasError = false;

    // Validate required fields
    if (!firstName.trim()) {
      setFirstNameError("First name is required");
      hasError = true;
    }
    
    if (!lastName.trim()) {
      setLastNameError("Last name is required");
      hasError = true;
    }

    // Validate password requirements
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
      // First check if the email exists
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false // This ensures we only check if the user exists
        }
      });
      
      // If no error is thrown when shouldCreateUser is false, it means the user exists
      if (!error) {
        setEmailError("This email is already registered. Please use a different email address.");
        setIsRegistering(false);
        return;
      }
      
      // If the error is not about user existence, it's another type of error
      if (error && !error.message.includes("Email not confirmed")) {
        // If the error is not about email confirmation, proceed with registration
        // Pass the userRole, firstName and lastName to the registration function
        const result = await doCreateUserWithEmailAndPassword(email, password, firstName, lastName, userRole);
        
        // Show confirmation popup instead of navigating immediately
        setShowConfirmationPopup(true);
      } else {
        // If the error is about email confirmation, it means the user exists but hasn't confirmed email
        setEmailError("This email is already registered but not confirmed. Please check your inbox for confirmation email.");
        setIsRegistering(false);
        return;
      }
    } catch (error) {
      // Enhanced error logging
      console.error("Registration error details:", error);
      
      // Handle specific error for duplicate email from Supabase
      if (error.message.includes("already registered") || 
          error.message.includes("already in use") || 
          error.message.includes("User already exists") ||
          error.code === "23505") {
        setEmailError("This email is already registered. Please use a different email address.");
      } else {
        // Show more detailed error message
        setErrorMessage(`Database error: ${error.message || "Unknown error occurred during registration"}`);
      }
    } finally {
      setIsRegistering(false);
    }
  };

  // Function to handle guest sign-in - stateless approach without database interaction
  const handleGuestSignIn = () => {
    setIsRegistering(true);
    setErrorMessage("");
    
    try {
      console.log("Setting up stateless guest access");
      
      // Use the enableGuestMode function from AuthContext
      // This properly sets up guest mode state in the context
      enableGuestMode();
      
      // Skip email verification for guest access
      setEmailVerificationSent(false);
      
      console.log("Guest access enabled - redirecting to index");
      
      // Navigate to index page
      navigate('/index');
    } catch (error) {
      console.error("Guest access error:", error);
      // Show a generic error message
      setErrorMessage("Failed to enable guest access. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };
  
  // Function to handle popup close
  const handleClosePopup = () => {
    setShowConfirmationPopup(false);
    navigate("/index"); // Navigate after closing the popup
  };

  if (userLoggedIn) {
    return <Navigate to="/index" replace />;
  }

  return (
    <>
      <Top/>

      <div>
      <div className="text-box-registration">
        <h1 className="text-title-registration">REGISTRATION FORM</h1>
      </div>

      <div className="registration-height-container">
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

              {/* User Role Selection Dropdown removed - all normal registrations are now "parkguide" role */}
              {/* <div className="registration-input-container">
                <label htmlFor="userRole" className="registration-input-label">User Role:</label>
                <div className={`registration-input-text ${userRoleError ? 'is-invalid' : ''}`}>
                  <span className="registration-icon"><i className="fa-solid fa-user-tag"></i></span>
                  <select
                    id="userRole"
                    className={`registration-input ${userRoleError ? 'is-invalid' : ''}`}
                    value={userRole}
                    onChange={(e) => {
                      setUserRole(e.target.value);
                      if (userRoleError) setUserRoleError("");
                    }}
                    required
                  >
                    <option value="guide">Park Guide</option>
                    <option value="visitor">Visitor</option>
                  </select>
                  {userRoleError && (
                    <div className="invalid-feedback" style={{ display: 'block', color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                      {userRoleError}
                    </div>
                  )}
                </div>
              </div> */}

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

              <button type="submit" className="register-btn" disabled={isRegistering}>{isRegistering ? "Registering..." : "Register Now"}</button>
              <div className="registration-alry-acc">
                <p className="registration-input-label">Already have an account? <Link to="/" className="registration-custom-login-text">Login</Link></p>
              </div>
              
              {/* Or separator */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
                <p style={{ margin: '0 10px', color: '#F6EFDC' }}>or</p>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
              </div>
              
              {/* Guest sign-in button */}
              <button type="button" className="register-btn bg-light text-success" onClick={handleGuestSignIn}>
                Sign in as Guest
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

      <>
        <ConfirmationPopup 
          show={showConfirmationPopup}
          onClose={handleClosePopup}
          title="Registration Successful"
          message="A confirmation email has been sent to your email address. Please check your inbox and follow the instructions to verify your account."
        />
      </>
      <Footer1 />
    </>
  );
};

export default Register;