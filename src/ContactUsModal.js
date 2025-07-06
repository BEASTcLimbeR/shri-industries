import React, { useState, useEffect } from 'react';
import './ContactUsModal.css';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { FaIndustry } from 'react-icons/fa';

// API endpoint - will use environment variable in production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ContactUsModal({ open, onClose, product = '' }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    product: '',
    city: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Autofill product field if product prop is provided and modal is opening
  useEffect(() => {
    if (open && product && form.product !== product) {
      setForm(f => ({ ...f, product }));
    }
    if (open && !product && form.product !== '') {
      setForm(f => ({ ...f, product: '' }));
    }
    // eslint-disable-next-line
  }, [open, product]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup in case modal is unmounted
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/send-enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: form.product,
          name: form.name,
          email: form.email,
          message: `Phone: ${form.phone}\nCity: ${form.city}\nMessage: ${form.message}`
        })
      });
      if (res.ok) {
        setSuccessMsg('Thank you! Your enquiry was sent successfully. We will get back to you soon.');
        setForm({ name: '', email: '', phone: '', product: '', city: '', message: '' });
      } else {
        setErrorMsg('Failed to send enquiry. Please check your details and try again, or contact us directly at shri_industry@yahoo.com.');
      }
    } catch (err) {
      setErrorMsg('Error sending enquiry. Please check your internet connection and try again, or contact us directly at shri_industry@yahoo.com.');
    }
    setLoading(false);
  };

  return (
    <div className="contact-modal-overlay">
      <div className="contact-modal-content">
        <button className="contact-modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="contact-modal-body">
          <div className="contact-modal-left">
            <h2 className="contact-modal-title">Contact us</h2>
            <div className="contact-modal-desc">
              At <span className="contact-modal-highlight">Shri Industry Ichalkaranji</span>, we've been manufacturing reliable food and fruit processing machinery <span className="contact-modal-highlight">since 1996</span>. With nearly 30 years of experience, we specialize in innovative, user-friendly solutions that simplify operations for businesses across India.<br /><br />
              What started as a graduate's idea to ease coconut shredding at home has evolved into a trusted brand powering food processing nationwide. We're committed to delivering quality, durability, and performance — helping industries grow with confidence.
            </div>
            <div className="contact-modal-info-list">
              <div className="contact-modal-info"><span className="contact-modal-info-icon"><MdEmail /></span><span className="contact-modal-info-text"> shri_industry@yahoo.com</span></div>
              <div className="contact-modal-info"><span className="contact-modal-info-icon"><MdPhone /></span><span className="contact-modal-info-text"> +91 9322663649</span></div>
              <div className="contact-modal-info"><span className="contact-modal-info-icon"><MdLocationOn /></span><span className="contact-modal-info-text"> 17/141 Gurukripa, Vivekanand Colony<br />Ichalkaranji Pin code: 416115</span></div>
              <div className="contact-modal-info"><span className="contact-modal-info-icon"><FaIndustry /></span><span className="contact-modal-info-text"> Food and Fruit Machines</span></div>
            </div>
          </div>
          <form className="contact-modal-form" onSubmit={handleSubmit}>
            <label>Your Name
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" required />
            </label>
            <label>Your Email
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required />
            </label>
            <label>Phone Number
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your number" required />
            </label>
            <label>Product
              <input type="text" name="product" value={form.product} onChange={handleChange} placeholder="Enter the product you are interested" />
            </label>
            <label>City
              <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="Enter your location" />
            </label>
            <label>Write your message here
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Enter your message" rows={4} />
            </label>
            <button className="contact-modal-btn" type="submit" disabled={loading}>
              {loading ? (
                <span className="spinner" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 8, width: 18, height: 18, border: '3px solid #fff', borderTop: '3px solid #1976ed', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
              ) : null}
              {loading ? 'Sending...' : 'Send Enquiry'}
            </button>
            {successMsg && <div className="contact-modal-success">{successMsg}</div>}
            {errorMsg && <div className="contact-modal-error">{errorMsg}</div>}
          </form>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .contact-modal-success {
          color: #2ecc40;
          background: #eafbe7;
          border-radius: 6px;
          padding: 10px 14px;
          margin-top: 18px;
          font-size: 1.08rem;
          text-align: center;
        }
        .contact-modal-error {
          color: #e74c3c;
          background: #fbeaea;
          border-radius: 6px;
          padding: 10px 14px;
          margin-top: 18px;
          font-size: 1.08rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default ContactUsModal; 