import "../styles.css";
import registrationImage from "../assets/registrationv2-img.png"; // Adjust this path if needed

function Register() {
  return (
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
            <form className="registration-form-body" id="registrationForm" noValidate>
              <div className="registration-input-container">
                <label htmlFor="firstname" className="registration-input-label">First Name:</label>
                <div className="registration-input-text">
                  <span className="registration-icon"><i className="fa-solid fa-user"></i></span>
                  <input
                    type="text"
                    id="firstname"
                    className="registration-input"
                    placeholder="E.g. John"
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
                    required
                    maxLength="25"
                    pattern="[A-Za-z\s]+"
                    title="Only alphabetical characters allowed (A-Z or a-z)"
                  />
                </div>
              </div>

              <div className="registration-input-container">
                <label htmlFor="username" className="registration-input-label">Username:</label>
                <div className="registration-input-text">
                  <span className="registration-icon"><i className="fa-solid fa-user"></i></span>
                  <input
                    type="text"
                    id="username"
                    className="registration-input"
                    placeholder="E.g. johnsmith"
                    required
                    maxLength="25"
                    pattern="[A-Za-z\s]+"
                    title="Only alphabetical characters allowed (A-Z or a-z)"
                  />
                </div>
              </div>

              <div className="registration-input-container">
                <label htmlFor="email" className="registration-input-label">Email Address:</label>
                <div className="registration-input-text">
                  <span className="registration-icon"><i className="fa-solid fa-envelope"></i></span>
                  <input
                    type="email"
                    id="email"
                    className="registration-input"
                    placeholder="E.g. littlejohnsmith@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="registration-input-container">
                <label htmlFor="password" className="registration-input-label">Password (25 characters max):</label>
                <div className="registration-input-text">
                  <span className="registration-icon"><i className="fa-solid fa-key"></i></span>
                  <input
                    type="text"
                    id="password"
                    className="registration-input"
                    required
                    maxLength="25"
                    pattern="[A-Za-z\s]+"
                    title="Only alphabetical characters allowed (A-Z or a-z)"
                  />
                </div>
              </div>

              <div className="registration-input-container">
                <label htmlFor="confirmpassword" className="registration-input-label">Confirm Password:</label>
                <div className="registration-input-text">
                  <span className="registration-icon"><i className="fa-solid fa-key"></i></span>
                  <input
                    type="text"
                    id="confirmpassword"
                    className="registration-input"
                    required
                    maxLength="25"
                    pattern="[A-Za-z\s]+"
                    title="Only alphabetical characters allowed (A-Z or a-z)"
                  />
                </div>
              </div>

              <hr className="registration-hr" />
              <div className="registration-passw-requirement">
                <p>Your password should be difficult to guess and follow these guidelines:</p>
                <ul>
                  <li>Maximum of 25 characters</li>
                  <li>Only alphabetical characters allowed (A-Z or a-z)</li>
                </ul>
              </div>

              <button type="submit" className="register-btn">Register Now</button>

              <div className="registration-alry-acc">
                <p>Already have an account? <a href="/login" title="Login" className="registration-custom-login-text">Login</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
