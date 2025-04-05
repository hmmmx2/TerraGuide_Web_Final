import '../styles.css';

function Footer1() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-column">
          <h3>Contact us</h3>
          <ul>
            <li>Phone Number: <a href="tel:+6012345678">+6012345678</a></li>
            <li>Email Address: <a href="mailto:terraguide@gmail.com">terraguide@gmail.com</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Address</h3>
          <p>
            Lot 218, KCLD,<br />
            Jalan Tapang, Kota Sentosa,<br />
            (93250 Kuching, Sarawak, Malaysia)
          </p>
        </div>
        
        <div className="footer-column">
          <h3>Follow Us</h3>
          <ul className="social-icons">
            <li><a href="#"><i className="fa-brands fa-twitter"></i> Twitter</a></li>
            <li><a href="#"><i className="fa-brands fa-facebook"></i> Facebook</a></li>
            <li><a href="#"><i className="fa-brands fa-instagram"></i> Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p> &copy; 2024 TerraGuide. All Rights Reserved</p>    
      </div>
    </footer>
  );
}

export default Footer1;
