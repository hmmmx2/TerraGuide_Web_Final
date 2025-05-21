import React, {useState, useEffect} from "react";
// import Firstheader from "../components/Firstheader";
import Footer1 from "../components/Footer1";
import "../styles.css";
import LoginImage from "../assets/login-img.png";
import Top from "../components/Top";
// Updated to use Supabase authentication
import { doSignInWithEmailAndPassword, doSignInWithEmailOTP } from "../supabase/auth";
import { sendPasswordResetOTP, resetPasswordWithOTP } from "../supabase/passwordReset";
import { useAuth } from "../contexts/authContext/supabaseAuthContext";
import { Navigate, useNavigate, Link, useLocation } from "react-router-dom";

const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

const Login = () => {
  const { userLoggedIn, emailVerificationSent, setEmailVerificationSent, enableGuestMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [useEmailOTP, setUseEmailOTP] = useState(false);
  
  // New state variables for password reset
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetOTP, setResetOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetStep, setResetStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [resetSuccess, setResetSuccess] = useState(false);
  
  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success' // 'success' or 'danger'
  });
  
  // Use the emailVerificationSent state from context instead of local state
  const otpSent = emailVerificationSent;

  // Check for logout message from URL state
  useEffect(() => {
    if (location.state?.message) {
      setAlert({
        show: true,
        message: location.state.message,
        type: location.state.type || 'danger'
      });
      
      // Clear the location state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
      
      // Auto-hide alert after 5 seconds
      const timer = setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location]); // Changed from [location.state] to [location] to ensure it runs when location changes

  // Add this effect to check for logout message in sessionStorage
  useEffect(() => {
    const logoutMessage = sessionStorage.getItem('logoutMessage');
    const logoutMessageType = sessionStorage.getItem('logoutMessageType') || 'success';
    
    if (logoutMessage) {
      setAlert({
        show: true,
        message: logoutMessage,
        type: logoutMessageType
      });
      
      // Clear the message from sessionStorage
      sessionStorage.removeItem('logoutMessage');
      sessionStorage.removeItem('logoutMessageType');
    }
  }, []); // Run once on component mount

  // Separate useEffect for auto-hiding the alert
  useEffect(() => {
    let timer;
    if (alert.show) {
      timer = setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
      }, 3000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [alert.show]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSigningIn) {
      return;
    }

    setIsSigningIn(true);
    setErrorMessage("");

    try {
      if (useEmailOTP) {
        // Use email OTP login
        await doSignInWithEmailOTP(email);
        setEmailVerificationSent(true);
      } else {
        // Use traditional password login
        const result = await doSignInWithEmailAndPassword(email, password);
        
        // Show success alert
        setAlert({
          show: true,
          message: 'Login successful!',
          type: 'success'
        });
        
        // Store login success in sessionStorage for Index.jsx to display
        sessionStorage.setItem('loginSuccess', 'true');
        
        // Check if user is admin and redirect to dashboard
        const user = result?.user;
        const role = user?.user_metadata?.role || 'parkguide';
        
        // Delay navigation slightly to show the alert
        setTimeout(() => {
          if (role === 'admin') {
            navigate("/dashboard");
          } else {
            navigate("/index");
          }
        }, 1500);
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSigningIn(false);
    }
  }

  // New function to handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (resetStep === 1) {
        // Step 1: Send reset email with OTP
        await sendPasswordResetOTP(email);
        setResetStep(2);
        setErrorMessage("A 4-digit code has been sent to your email. Please check your inbox.");
      } else if (resetStep === 2) {
        // Step 2: Verify OTP
        if (!resetOTP || resetOTP.length !== 4) {
          setErrorMessage("Please enter a valid 4-digit code");
          return;
        }
        setResetStep(3);
      } else if (resetStep === 3) {
        // Step 3: Set new password
        if (newPassword !== confirmNewPassword) {
          setErrorMessage("Passwords don't match");
          return;
        }
        if (newPassword.length < 8) {
          setErrorMessage("Password must be at least 8 characters long");
          return;
        }
        // Update password with OTP verification
        await resetPasswordWithOTP(email, resetOTP, newPassword);
        setResetSuccess(true);
        setShowResetPassword(false);
        setResetStep(1);
        setErrorMessage("Password has been reset successfully. Please log in with your new password.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  if (userLoggedIn) {
    return <Navigate to="/index" replace />;
  }

  return (
      <>
        <Top/>

        {/* Bootstrap 5 Alert - Make sure it's visible and positioned properly */}
        {alert.show && (
          <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1100, width: "auto" }}>
            <div className={`alert alert-${alert.type} d-flex align-items-center py-2 px-4 fade show`} role="alert">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <div>
                  <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} me-2`}></i>
                  {alert.message}
                </div>
                <button 
                  type="button" 
                  className="btn-close ms-3" 
                  onClick={() => setAlert(prev => ({ ...prev, show: false }))} 
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </div>
        )}

        <div className="registration-height-container mt-5">
          <div className="registration-svg-form">
            <div className="registration-svg">
              <div className="registration-svg-container">
                <img
                    src={LoginImage}
                    className="registration-svg-image"
                    alt="Login Illustration"
                />
              </div>
            </div>

            <div className="registration-form">
              {!showResetPassword ? (
                <form
                    className="registration-form-body"
                    id="loginForm"
                    onSubmit={onSubmit}
                    noValidate
                >
                  <div className="registration-input-container">
                    <label htmlFor="email" className="registration-input-label">
                      Email:
                    </label>
                    <div className="registration-input-text">
                    <span className="registration-icon">
                      <i className="fa-solid fa-user"></i>
                    </span>
                      <input
                          type="email"
                          name="email"
                          className="registration-input"
                          id="email"
                          placeholder="E.g. johnsmith@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                      />
                    </div>
                  </div>

                  {!useEmailOTP && (
                    <div className="registration-input-container">
                      <label htmlFor="password" className="registration-input-label">
                        Password (25 characters maximum):
                      </label>
                      <div className="registration-input-text" style={{ position: 'relative' }}>
                        <span className="registration-icon">
                          <i className="fa-solid fa-key"></i>
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="registration-input"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!useEmailOTP}
                            maxLength="25"
                            title="Password required (max 25 characters)"
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
                      </div>
                      <div style={{ textAlign: 'right', marginTop: '5px' }}>
                        <a type="button" className="link-light link-offset-2 link-underline-light link-underline-opacity-50 link-underline-opacity-100-hover" onClick={() => setShowResetPassword(true)}>
                          Forgot Password?
                        </a>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                      <p className="registration-passw-requirement" aria-live="assertive">
                        {errorMessage}
                      </p>
                  )}
                  
                  {otpSent && (
                      <p className="registration-passw-requirement" style={{ color: 'white' }} aria-live="assertive">
                        A magic link has been sent to your email. Please check your inbox and click the link to log in.
                      </p>
                  )}
                  
                  <div className="registration-input-container">
                    <label className="registration-input-label" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={useEmailOTP} 
                        onChange={() => setUseEmailOTP(!useEmailOTP)}
                        style={{ marginRight: '8px' }}
                      />
                      Login with email verification (no password required)
                    </label>
                  </div>

                  <div className="login-container">
                    <button type="submit" className="register-btn" disabled={isSigningIn}>
                      {isSigningIn ? "Processing..." : otpSent ? "Resend Email Link" : useEmailOTP ? "Send Login Link" : "Log In"}
                    </button>
                    
                    <p className="or-text" style={{ margin: '15px 0', textAlign: 'center', color: 'white' }}>or</p>
                    
                    <button type="button" className="register-btn bg-light text-success" 
                      onClick={() => {
                        enableGuestMode();
                        navigate('/index');
                      }}
                    >
                      Sign in as Guest
                    </button>
                    <div className="registration-alry-acc">
                      <p className="registration-input-label">
                        Don't have an account?{" "}
                        <Link to="/signup" className="registration-custom-login-text">Sign up</Link>
                      </p>
                    </div>
                  </div>
                </form>
              ) : (
                <form
                  className="registration-form-body"
                  onSubmit={handlePasswordReset}
                  noValidate
                >
                  <h2 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
                    Reset Password
                  </h2>

                  {resetStep === 1 && (
                    <div className="registration-input-container">
                      <label htmlFor="resetEmail" className="registration-input-label">
                        Enter your email:
                      </label>
                      <div className="registration-input-text">
                        <span className="registration-icon">
                          <i className="fa-solid fa-envelope"></i>
                        </span>
                        <input
                          type="email"
                          id="resetEmail"
                          className="registration-input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {resetStep === 2 && (
                    <div className="registration-input-container">
                      <label htmlFor="otp" className="registration-input-label">
                        Enter the 4-digit code sent to your email:
                      </label>
                      <div className="registration-input-text">
                        <span className="registration-icon">
                          <i className="fa-solid fa-key"></i>
                        </span>
                        <input
                          type="text"
                          id="otp"
                          className="registration-input"
                          value={resetOTP}
                          onChange={(e) => setResetOTP(e.target.value)}
                          maxLength="4"
                          pattern="[0-9]{4}"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {resetStep === 3 && (
                    <>
                      <div className="registration-input-container">
                        <label htmlFor="newPassword" className="registration-input-label">
                          New Password:
                        </label>
                        <div className="registration-input-text">
                          <span className="registration-icon">
                            <i className="fa-solid fa-lock"></i>
                          </span>
                          <input
                            type="password"
                            id="newPassword"
                            className="registration-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength="8"
                          />
                        </div>
                      </div>

                      <div className="registration-input-container">
                        <label htmlFor="confirmNewPassword" className="registration-input-label">
                          Confirm New Password:
                        </label>
                        <div className="registration-input-text">
                          <span className="registration-icon">
                            <i className="fa-solid fa-lock"></i>
                          </span>
                          <input
                            type="password"
                            id="confirmNewPassword"
                            className="registration-input"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            minLength="8"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {errorMessage && (
                    <p className="registration-passw-requirement" aria-live="assertive">
                      {errorMessage}
                    </p>
                  )}

                  <div className="login-container">
                    <button type="submit" className="register-btn">
                      {resetStep === 1 ? "Send Reset Code" : 
                       resetStep === 2 ? "Verify Code" : 
                       "Reset Password"}
                    </button>
                    
                    <button
                      type="button"
                      className="btn bg-light text-success register-btn"
                      onClick={() => {
                        setShowResetPassword(false);
                        setResetStep(1);
                        setErrorMessage("");
                      }}
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <footer>
          <Footer1 />
        </footer>
      </>
  );
}

export default Login;
