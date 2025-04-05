import '../styles.css';
import terraguideLogo from '../assets/TerraGuide_Logo.png';

function Firstheader() {
  return (
    <nav id="navbar" className="navbartemplate">
      <div className="nav-logo">
        <a href="index.html">
          <img src={terraguideLogo} alt="TerraGuide Logo" />
        </a>
      </div>

      <ul id="nav-links" className="nav-links">
        <li className="navbar-item">
          <a href="#">Home</a>
        </li>
        <li className="navbar-item">
          <a href="#">About Us</a>
        </li>
        <li className="navbar-dropdown">
          <div className="navbar-dropbtn">
            <a href="#">My Courses</a>
            <i className="fa fa-caret-down"></i>
          </div>
          <div className="dropdown-content">
            <a href="#">Course 1</a>
            <a href="#">Course 2</a>
          </div>
        </li>
        <li className="navbar-item">
          <a href="#">Dext AI</a>
        </li>
        <li className="navbar-item">
          <a href="#">Blogs</a>
        </li>
        <li className="navbar-item">
          <a href="#">Park Guide</a>
        </li>
      </ul>

      <div>
        <a href="#" className="action_btn1" id="signup">Sign Up</a>
        <span className="divider"></span>
        <a href="#" className="action_btn2" id="login">Login</a>
      </div>

      {/* Mobile toggle menu */}
      <div className="navbar-toggle-dropdown">
        <div className="nav-toggle-btn-bars">
          <i className="fa-solid fa-bars"></i>
          <ul className="navbar-menu-dropdown">
            <li><a href="index.html">Home</a></li>
            <li><a href="aboutus.html">About Us</a></li>
            <li><a href="courses.html">My Courses</a></li>
            <li><a href="dextai.html">Dext AI</a></li>
            <li><a href="blogs.html">Blogs</a></li>
            <li><a href="parkguide.html">Park Guide</a></li>
          </ul>
        </div>
      </div>

      <div className="navbar-toggle-dropdown">
        <div className="nav-toggle-btn-user">
          <i className="fa-solid fa-user"></i>
          <ul className="navbar-profile-dropdown">
            <li><a href="registration.html">Sign Up</a></li>
            <li><a href="login.html">Log In</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Firstheader;
