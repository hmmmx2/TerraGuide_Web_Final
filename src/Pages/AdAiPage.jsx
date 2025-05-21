import React from 'react';
import '../adaipage.css';

export default function AdAiPage() {
  return (
    <div className="adaipage">
      {/* Title overlaps the feature box border */}
      <h1 className="adaipage__title">DEXT AI</h1>

      <div className="adaipage__feature-box">
        <div className="adaipage__green-card">
          <p>
            everything is green here<br/>
            but I can put sticker here
          </p>
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
  );
}
