import React, {useState} from "react";
// import Firstheader from "../components/Firstheader";
import Footer1 from "../components/Footer1";
import "../styles.css";
import LoginImage from "../assets/login-img.png";
import Top from "../components/Top";
// Added by Desmond @ 17 April 2025 : Start
import { doSignInWithEmailAndPassword} from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { Navigate, useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSigningIn) {
      return;
    }

    setIsSigningIn(true);
    setErrorMessage("");

    try {
      await doSignInWithEmailAndPassword(email, password);
      navigate("/index");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSigningIn(false);
    }
  }

  if (userLoggedIn) {
    return <Navigate to="/index" replace />;
  }
// End

// Commented by Desmond @ 17 April 2025
// export default function Register() {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission logic here
//   };

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
              <form
                  className="registration-form-body"
                  id="loginForm"
                  // onSubmit={handleSubmit}
                  // Added by Desmond @ 17 April 2025
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
                        // Added by Desmond @ 17 April 2025
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        // End
                        required
                        // Commented by Desmond @ 17 April 2025
                        // maxLength="25"
                        // pattern="[A-Za-z\s]+"
                        // title="Only alphabetical characters allowed (A-Z or a-z)"
                    />
                  </div>
                </div>

                <div className="registration-input-container">
                  <label htmlFor="password" className="registration-input-label">
                    Password (25 characters maximum):
                  </label>
                  <div className="registration-input-text">
                  <span className="registration-icon">
                    <i className="fa-solid fa-key"></i>
                  </span>
                    <input
                        type="password"
                        name="password"
                        className="registration-input"
                        id="password"
                        // Added by Desmond @ 17 April 2025
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        // End
                        required
                        maxLength="25"
                        title="Password required (max 25 characters)"
                    />
                  </div>
                </div>

                {/* Added by Desmond @ 17 April 2025 */}
                {errorMessage && (
                    <p className="registration-passw-requirement" aria-live="assertive">
                      {errorMessage}
                    </p>
                )}

                <div className="login-container">
                  {/* Changed by Desmond @ 17 April 2025, added 'disabled'. */}
                  {/* Need to change the className from register-btn back to login-button */}
                  <button type="submit" className="register-btn" disabled={isSigningIn}>{isSigningIn ? "Logging in..." : "Log In"}</button>
                  {/*<button className="login-button" disabled={isSigningIn}>*/}
                  {/*  {isSigningIn ? "Logging in..." : "Log In"}*/}
                  {/*</button>*/}
                  {/* Commented by Desmond @ 17 April 2025 */}
                  {/*<p className="or-text">or</p>*/}
                  {/*<div className="social-login">*/}
                  {/*  <a href="#" className="social-icon">*/}
                  {/*    <img src="#" alt="Social login 1" />*/}
                  {/*  </a>*/}
                  {/*  <a href="#" className="social-icon">*/}
                  {/*    <img src="#" alt="Social login 2" />*/}
                  {/*  </a>*/}
                  {/*</div>*/}
                  <div className="registration-alry-acc">
                    <p className="registration-input-label">
                      Don't have an account?{" "}
                      {/* Added link by Desmond @ 18 April 2025 */}
                      <Link to="/signup" className="registration-custom-login-text">Sign up</Link>
                      {/* Commented by Desmond @ 17 April 2025, need to add the link back. */}
                      {/*<a href="registration.html">Sign up</a>*/}
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <footer>
          <Footer1 />
        </footer>
      </>
  );
};

// Added by Desmond @ 17 April 2025
export default Login;