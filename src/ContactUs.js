import React from 'react';
import './ContactUs.css';
import { MdPhone, MdEmail, MdLocationOn } from "react-icons/md";

function ContactUs({ onEnquire = () => {} }) {
  return (
    <section className="contactus-section" id="contact">
      <h2 className="contactus-title">Contact us</h2>
      <div className="contactus-info">
        <div className="contactus-info-block">
          <MdPhone className="contact-icon" />
          <div>
            <div className="contactus-label">Contact:</div>
            <div className="contactus-value">
              Mobile -
              <a
                href="tel:+919822071078"
                style={{ color: '#1976ff', textDecoration: 'underline', marginLeft: 4 }}
                aria-label="Call +91 9822071078"
              >
                +91 9822071078
              </a>
              {" | "}
              <a
                href="tel:+917776826505"
                style={{ color: '#1976ff', textDecoration: 'underline', marginLeft: 4 }}
                aria-label="Call +91 7776826505"
              >
                +91 7776826505
              </a>
            </div>
            <div className="contactus-value">
              WhatsApp - 
              <a
                href="https://wa.me/919322663649?text=Hello%20Shri%20Industries%20I%20am%20interested%20in%20your%20products"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#25D366', textDecoration: 'underline', marginLeft: 4 }}
                aria-label="Chat with us on WhatsApp"
              >
                +91 9322663649
              </a>
            </div>
          </div>
        </div>
        <div className="contactus-info-block">
          <MdEmail className="contact-icon" />
          <div>
            <div className="contactus-label">Email:</div>
            <div className="contactus-value">
              <a
                href="mailto:shri_industry@yahoo.com"
                style={{ color: '#1976ff', textDecoration: 'underline' }}
                aria-label="Send email to Shri Industries"
              >
                shri_industry@yahoo.com
              </a>
            </div>
          </div>
        </div>
        <div className="contactus-info-block">
          <MdLocationOn className="contact-icon" />
          <div>
            <div className="contactus-label">Address:</div>
            <div className="contactus-value">
              <a
                href="https://www.google.com/maps/search/?api=1&query=17%2F141+Gurukripa%2C+Vivekanand+Colony+Ichalkaranji+416115"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1976ff', textDecoration: 'underline' }}
                aria-label="View address on Google Maps"
              >
                17/141 Gurukripa, Vivekanand Colony Ichalkaranji
              </a>
            </div>
            <div className="contactus-value">Pin code: 416115</div>
          </div>
        </div>
        <button className="contactus-btn" onClick={onEnquire}>Contact us</button>
      </div>
    </section>
  );
}

export default ContactUs;