import React from 'react';
import { Link } from 'react-router-dom';
import DextIllustration from '../assets/dextai.png';
import '../adaipage.css';
import AdminTop from '../components/AdminTop';
import Footer1 from '../components/Footer1';

export default function AdaIPage() {
  return (
    <>
      <AdminTop/>
      <div className="adaipage" style={{ minHeight: 'calc(90vh - 160px)' }}>
        {/* Title overlapping the box border */}
        <h1 className="adaipage__title fw-bold">DEXT AI</h1>

        <Link to="/identify" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="adaipage__feature-box" style={{ cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.02)' } }}>
            <div className="adaipage__green-card">
              {/* Insert the illustration here */}
              <img
                src={DextIllustration}
                alt="Dext AI illustration"
                className="adaipage__green-card-img"
              />
            </div>

            <div className="adaipage__text-block">
              <h2>Intrusion Detection System</h2>
              <p>
                Our AI can identify any endangered animal and plants<br/>
                in the National Park
              </p>
            </div>
          </div>
        </Link>
      </div>
      <Footer1/>
    </>
  );
}
