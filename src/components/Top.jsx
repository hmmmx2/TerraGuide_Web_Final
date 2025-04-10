import { useEffect } from 'react';
import '../top.css';
import terraguideLogo from '../assets/TerraGuide_Logo.png';

function Top() {
  useEffect(() => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    const handleClick = () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    };

    hamburger.addEventListener('click', handleClick);
    
    return () => {
      hamburger.removeEventListener('click', handleClick);
    };
  }, []);



  return (
    <header>
      <nav>
        <div className="navbar-container">
          <div className="hamburger">
            <div></div>
            <div></div>
            <div></div>
          </div>
          
          <a href="#" className="logo">
            <img src={terraguideLogo} alt="TerraGuide Logo"/>
          </a>
          
          <div className="nav-links">
            <a href="#">Home</a>
            <a href="#">About Us</a>
            <div className="dropdown">
              <a href="#">My Courses</a>
              <div className="dropdown-content">
                <a href="#">Course 1</a>
                <a href="#">Course 2</a>
              </div>
            </div>
            <a href="#">Dext AI</a>
            <a href="#">Blogs</a>
            <a href="#">Park Guide</a>
          </div>
          
          <div className="auth-buttons">
            <a href="#" className="sign-in">Sign In</a>
            <div className="separator"></div>
            <a href="#" className="log-in">Log In</a>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Top;