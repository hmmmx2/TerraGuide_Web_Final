import React, { useState } from 'react'
import Footer1 from "../components/Footer1";
import Top from "../components/Top";
import "../styles.css";
import registrationImage from "../assets/registrationv2-img.png";
// Added by Desmond @ 17 April 2025 : Start
import { useAuth } from "../contexts/authContext";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import {Link, Navigate, useNavigate} from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

    // Validate password requirements
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }
    setIsRegistering(true);
    setErrorMessage(""); // Clear previous errors
    try {
      await doCreateUserWithEmailAndPassword(email, password);
      // After successful registration
      navigate("/index");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  if (userLoggedIn) {
    return <Navigate to="/index" replace />;
  }
// End

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
            {/* Changed by Desmond @ 17 April 2025, added 'onSubmit' and error message. */}
            <form className="registration-form-body" id="registrationForm" noValidate onSubmit={onSubmit}>
            {/* End */}
              <div className="registration-input-container">
                <label htmlFor="firstname" className="registration-input-label">First Name:</label>
                <div className="registration-input-text">
                  <span className="registration-icon"><i className="fa-solid fa-user"></i></span>
                  <input
                    type="text"
                    id="firstname"
                    className="registration-input"
                    placeholder="E.g. John"
                    // Added by Desmond @ 17 April 2025
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    // End
                    required
                    maxLength="25"
                    pattern="[A-Za-z\s]+"
                    title="Only alphabetical characters allowed (A-Z or a-z)"
                  />
                </div>
              </div>

              <div className="registration-input-container">
                <label htmlFor="lastname" className="registration-input-label">Last Name:</label>
                <div className="registration-input-text">
                  <span className="registration-icon"><i className="fa-solid fa-user"></i></span>
                  <input
                    type="text"
                    id="lastname"
                    className="registration-input"
                    placeholder="E.g. Smith"
                    // Added by Desmond @ 17 April 2025
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    // End
                    required
                    maxLength="25"
                    pattern="[A-Za-z\s]+"
                    title="Only alphabetical characters allowed (A-Z or a-z)"
                  />
                </div>
              </div>

              {/* Commented by Desmond @ 17 April 2025, input not used. */}
              {/*<div className="registration-input-container">*/}
              {/*  <label htmlFor="username" className="registration-input-label">Username:</label>*/}
              {/*  <div className="registration-input-text">*/}
              {/*    <span className="registration-icon"><i className="fa-solid fa-user"></i></span>*/}
              {/*    <input*/}
              {/*      type="text"*/}
              {/*      id="username"*/}
              {/*      className="registration-input"*/}
              {/*      placeholder="E.g. johnsmith"*/}
              {/*      required*/}
              {/*      maxLength="25"*/}
              {/*      pattern="[A-Za-z\s]+"*/}
              {/*      title="Only alphabetical characters allowed (A-Z or a-z)"*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</div>*/}

              <div className="registration-input-container">
                <label htmlFor="email" className="registration-input-label">Email Address:</label>
                <div className="registration-input-text">
                  <span className="registration-icon"><i className="fa-solid fa-envelope"></i></span>
                  <input
                    type="email"
                    id="email"
                    className="registration-input"
                    placeholder="E.g. littlejohnsmith@gmail.com"
                    // Added by Desmond @ 17 April 2025
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // End
                    required
                  />
                </div>
              </div>

              <div className="registration-input-container">
                <label htmlFor="password" className="registration-input-label">Password (25 characters max):</label>
                <div className="registration-input-text">
                  <span className="registration-icon"><i className="fa-solid fa-key"></i></span>
                  <input
                    type="password" // Changed by Desmond @ 17 April 2025,  from text to password
                    id="password"
                    className="registration-input"
                    // Added by Desmond @ 17 April 2025
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // End
                    required
                    // Added by Desmond @ 17 April 2025
                    minLength="8"
                    // End
                    maxLength="25"
                    // Commented by Desmond @ 17 April 2025
                    // pattern="[A-Za-z\s]+"
                    // title="Only alphabetical characters allowed (A-Z or a-z)"
                  />
                </div>
              </div>

              <div className="registration-input-container">
                <label htmlFor="confirmpassword" className="registration-input-label">Confirm Password:</label>
                <div className="registration-input-text">
                  <span className="registration-icon"><i className="fa-solid fa-key"></i></span>
                  <input
                    type="password" // Changed by Desmond @ 17 April 2025,  from text to password
                    id="confirmpassword"
                    className="registration-input"
                    // Added by Desmond @ 17 April 2025
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    // End
                    required
                    // Added by Desmond @ 17 April 2025
                    minLength="8"
                    // End
                    maxLength="25"
                    // Commented by Desmond @ 17 April 2025
                    // pattern="[A-Za-z\s]+"
                    // title="Only alphabetical characters allowed (A-Z or a-z)"
                  />
                </div>
              </div>

              <hr className="registration-hr" />
              {errorMessage && <p className="registration-passw-requirement">{errorMessage}</p>}
              <div className="registration-passw-requirement">
                <p>Your password should be difficult to guess and follow these guidelines:</p>
                <ul>
                  <li>Minimum of 8 characters</li>
                  <li>Maximum of 25 characters</li>
                  <li>Must include at least one uppercase letter</li>
                  <li>Must include at least one lowercase letter</li>
                  {/* Added by Desmond @ 17 April 2025 : Start */}
                  <li>Must include at least one number (0-9)</li>
                  {/* End */}
                  <li>Must include at least one symbol (e.g., !, @, #, $, etc.)</li>
                  {/*<li>Only alphabetical characters allowed (A-Z or a-z)</li>*/}
                </ul>
              </div>

              {/* Changed by Desmond @ 17 April 2025, added 'disabled' for submit button. */}
              <button type="submit" className="register-btn" disabled={isRegistering}>{isRegistering ? "Registering..." : "Register Now"}</button>
              {/* End */}
              <div className="registration-alry-acc">
                <p className="registration-input-label">Already have an account? <Link to="/" className="registration-custom-login-text">Login</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

      <>
        <Footer1 />
      </>

    </>

  );
};

// Added by Desmond @ 17 April 2025
export default Register;