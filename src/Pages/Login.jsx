import React, {useState} from "react";
// import Firstheader from "../components/Firstheader";
import Footer1 from "../components/Footer1";
import "../styles.css";
import LoginImage from "../assets/login-img.png";
import Top from "../components/Top";
// Updated to use Supabase authentication
import { doSignInWithEmailAndPassword, doSignInWithEmailOTP } from "../supabase/auth";
import { sendPasswordResetOTP, resetPasswordWithOTP } from "../supabase/passwordReset";
import { useAuth } from "../contexts/authContext/supabaseAuthContext";
import { Navigate, useNavigate, Link } from "react-router-dom";

const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

const Login = () => {
  const { userLoggedIn, emailVerificationSent, setEmailVerificationSent, enableGuestMode } = useAuth();
  const navigate = useNavigate();

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
  
  // Use the emailVerificationSent state from context instead of local state
  const otpSent = emailVerificationSent;

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
        await doSignInWithEmailAndPassword(email, password);
        navigate("/index");
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

        <div className="text-box-registration">
          <h1 className="text-title-registration">LOGIN</h1>
        </div>

        <div className="registration-height-container">
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
                        <button
                          type="button"
                          onClick={() => setShowResetPassword(true)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#007bff',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '0.9em'
                          }}
                        >
                          Forgot Password?
                        </button>
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
                    
                    <button 
                      type="button" 
                      className="register-btn" 
                      style={{ backgroundColor: '#FFC107', color: '#000' }}
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
                      className="register-btn"
                      style={{ backgroundColor: '#6c757d', marginTop: '10px' }}
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
};

export default Login;