import './styles.css'
import terraguideLogo from './assets/TerraGuide_Logo.png';


function Firstheader(){
  return(
    <nav id="navbar" class="navbartemplate">
      <div class="nav-logo">
        <a href="index.html">
          <img src={terraguideLogo} alt="TerraGuide Logo"></img>
        </a>
      </div>

      <ul id="nav-links" class="nav-links">
        <li class="navbar-item">
          <a href="">Home</a>
        </li>

        <li class="navbar-item">
          <a href="">About Us</a>
        </li>

        <li class="navbar-dropdown">
          <div class="navbar-dropbtn">
            <a href='#'>Course 1</a>
            <a href='#'>Course 2</a>
          </div>
        </li>

        <li class="navbar-item">
          <a href="">Dext AI</a>
        </li>

        <li class="navbar-item">
          <a href="">Blogs</a>
        </li>

        <li class="navbar-item">
          <a href="">Park Guide</a>
        </li>
      </ul>

      <div>
        <a href="" class="action_btn1" id="signup">Sign Up</a>
        <span class="divider"></span>
        <a href="" class="action_btn2" id="login">Login</a>
      </div>

      {/*--Mobile toggle menus-- */}
      <div class="navbar-toggle-dropdown">
          <div class="nav-toggle-btn-bars">
            <i class="fa-solid fa-bars"></i>
            <ul class="navbar-menu-dropdown">
              <li><a href="index.html">Home</a></li>
              <li><a href="aboutus.html">About Us</a></li>
              <li><a href="courses.html">My Courses</a></li>
              <li><a href="dextai.html">Dext AI</a></li>
              <li><a href="blogs.html">Blogs</a></li>
              <li><a href="parkguide.html">Park Guide</a></li>
            </ul>
          </div>
        </div>
  
        <div class="navbar-toggle-dropdown">
          <div class="nav-toggle-btn-user">
            <i class="fa-solid fa-user"></i>
            <ul class="navbar-profile-dropdown">
              <li><a href="registration.html">Sign Up</a></li>
              <li><a href="login.html">Log In</a></li>
            </ul>
          </div>
        </div>
    </nav>
  );
}

export default Firstheader