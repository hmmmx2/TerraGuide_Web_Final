import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer1() {
  return (
    <footer className="text-white py-4" style={{
      backgroundColor: '#4E6E4E',
      width: '100%',
      overflowX: 'hidden'
    }}>
      <div className="container text-center">
        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <h5 className="mb-3 fw-bold">Contact us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="fas fa-phone me-2"></i>
                <a href="tel:+6012345678" className="text-white text-decoration-none">+6012345678</a>
              </li>
              <li className="mb-2">
                <i className="fas fa-envelope me-2"></i>
                <a href="mailto:terraguide@gmail.com" className="text-white text-decoration-none">terraguide@gmail.com</a>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h5 className="mb-3 fw-bold">Address</h5>
            <p>
              Lot 218, KCLD,<br />
              Jalan Tapang, Kota Sentosa,<br />
              (93250 Kuching, Sarawak, Malaysia)
            </p>
          </div>
          
          <div className="col-md-4">
            <h5 className="mb-3 fw-bold">Follow Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none">
                  <i className="fa-brands fa-twitter me-2"></i> Twitter
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none">
                  <i className="fa-brands fa-facebook me-2"></i> Facebook
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none">
                  <i className="fa-brands fa-instagram me-2"></i> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-4 pt-3 border-top border-light">
          <p className="mb-0"> &copy; 2024 TerraGuide. All Rights Reserved</p>    
        </div>
      </div>
    </footer>
  );
}

export default Footer1;
