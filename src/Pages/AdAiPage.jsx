import React from 'react';
import DextIllustration from '../assets/dextai.png';
import '../adaipage.css';
import AdminTop from '../components/AdminTop';
import Footer1 from '../components/Footer1';

export default function AdaIPage() {
  return (
    <>
      <AdminTop/>
        <div className="adaipage">
          {/* Title overlapping the box border */}
          <h1 className="adaipage__title">DEXT AI</h1>

          <div className="adaipage__feature-box">
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
        </div>
      <Footer1/>
    </>
  );
}
