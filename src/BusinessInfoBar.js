import React from 'react';
import './BusinessInfoBar.css';

function BusinessInfoBar() {
  return (
    <div className="business-info-bar">
      <div className="info-card">
        <span className="info-icon" role="img" aria-label="factory">🏭</span>
        <div>
          <div className="info-label">Nature of Business</div>
          <div className="info-value">Manufacturer</div>
        </div>
      </div>
      <div className="info-card">
        <span className="info-icon" role="img" aria-label="legal">⚖️</span>
        <div>
          <div className="info-label">Legal Status of Firm</div>
          <div className="info-value">Proprietorship</div>
        </div>
      </div>
      <div className="info-card">
        <span className="info-icon" role="img" aria-label="gst">🧾</span>
        <div>
          <div className="info-label">GST Number</div>
          <div className="info-value">27AEWPB6030P1ZZ</div>
        </div>
      </div>
      <div className="info-card">
        <span className="info-icon" role="img" aria-label="calendar">📅</span>
        <div>
          <div className="info-label">GST Registration Date</div>
          <div className="info-value">01-07-2017</div>
        </div>
      </div>
    </div>
  );
}

export default BusinessInfoBar; 