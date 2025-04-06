import Firstheader from "../components/Firstheader";
import Footer1 from "../components/Footer1";
import "../styles.css";
import LoginImage from "../assets/login-img.png";

export default function Reg() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <>
      <header>
        <Firstheader />
      </header>

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
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="registration-input-container">
                <label htmlFor="username" className="registration-input-label">
                  Username:
                </label>
                <div className="registration-input-text">
                  <span className="registration-icon">
                    <i className="fa-solid fa-user"></i>
                  </span>
                  <input
                    type="text"
                    name="username"
                    className="registration-input"
                    id="username"
                    placeholder="E.g. littlejohn"
                    required
                    maxLength="25"
                    pattern="[A-Za-z\s]+"
                    title="Only alphabetical characters allowed (A-Z or a-z)"
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
                    required
                    maxLength="25"
                    title="Password required (max 25 characters)"
                  />
                </div>
              </div>

              <div className="login-container">
                <button className="login-button">Log In</button>
                <p className="or-text">or</p>
                <div className="social-login">
                  <a href="#" className="social-icon">
                    <img src="#" alt="Social login 1" />
                  </a>
                  <a href="#" className="social-icon">
                    <img src="#" alt="Social login 2" />
                  </a>
                </div>
                <p className="signup-text">
                  Don't have an account?{" "}
                  <a href="registration.html">Sign up</a>
                </p>
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
}
