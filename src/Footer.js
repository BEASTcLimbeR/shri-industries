import React from 'react';
import './Footer.css';
import { FaYoutube, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-main">
        <div className="footer-brand">
          <img src={process.env.PUBLIC_URL + '/final-logo.svg'} alt="Shri Industry Logo" className="footer-logo" />
          <div className="footer-brand-text">
            <img src={process.env.PUBLIC_URL + '/company-logo-svg.svg'} alt="Shri Industry Text Logo" className="footer-logo-text" style={{ width: '180px', height: 'auto', marginBottom: 4, marginTop: 0 }} />
            <div className="footer-brand-desc">“Shri Industry Ichalkaranji — Simplifying food and fruit processing with reliable, innovative machinery since 1996.”</div>
            <div className="footer-socials">
              <a href="https://www.youtube.com/@foodandfruitmachines5382" className="footer-social" aria-label="YouTube"><FaYoutube /></a>
              <a href="shri_industry@yahoo.com" className="footer-social" aria-label="Email"><FaEnvelope /></a>
              <a href="https://www.google.com/maps/dir//PC7X%2BJ48,+opp.+anganwadi,+Ganganagar,+Ichalkaranji,+Maharashtra+416116/@16.7140212,74.3654263,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bc11d6d2c25ae3b:0x11cf63cabb280ab2!2m2!1d74.4478281!2d16.7140375?hl=en-IN&entry=ttu&g_ep=EgoyMDI1MDYyMy4yIKXMDSoASAFQAw%3D%3D" className="footer-social" aria-label="Maps"><FaMapMarkerAlt /></a>
            </div>
          </div>
        </div>
        <div className="footer-hours">
          <div className="footer-hours-title">Opening Hours</div>
          <div>Weekdays: 9.00am-2pm and 3pm-6pm</div>
          <div>Saturday, Sunday: 8:00am-2.00pm</div>
          <div className="footer-hours-closed">Monday: Closed</div>
        </div>
        <div className="footer-contact">
          <div className="footer-contact-title">Address</div>
          <div>
            <a href="https://www.google.com/maps/dir//Shri+Industry,+PC7X%2BJ48,+opp.+anganwadi,+Ganganagar,+Ichalkaranji,+Maharashtra+416116/@16.7141156,74.4066285,13z/data=!4m9!4m8!1m0!1m5!1m1!1s0x3bc11d6d2c25ae3b:0x11cf63cabb280ab2!2m2!1d74.4478281!2d16.7140375!3e0?entry=ttu&g_ep=EgoyMDI1MDYzMC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" style={{ color: '#61dafb', textDecoration: 'underline' }}>
              17/141 Gurukripa, Vivekanand Colony<br />Ichalkaranji Pin code: 416115
            </a>
          </div>
          <div className="footer-contact-title">Contact:</div>
          <div className="footer-contact-links">
            <a href="mailto:shri_industry@yahoo.com">shri_industry@yahoo.com</a><br />
            <a href="tel:+919322663649">+91 9322663649</a> | <a href="tel:+919822071078">+91 9822071078</a> | <a href="tel:+917776826505">+91 7776826505</a>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        © 2007 Shri Industry. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer; 