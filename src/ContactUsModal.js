import React, { useState, useEffect, useRef } from 'react';
import './ContactUsModal.css';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { FaIndustry } from 'react-icons/fa';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import secureApiClient from './utils/secureApiClient';
import blockchainSecurity from './utils/blockchainSecurity';

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
  const [blockchainConnected, setBlockchainConnected] = useState(false);
  const [securityStatus, setSecurityStatus] = useState('initializing');
  const modalRef = useRef();

  // Initialize blockchain security when modal opens
  useEffect(() => {
    if (open) {
      initializeSecurity();
    }
  }, [open]);

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

  // Initialize blockchain security
  const initializeSecurity = async () => {
    try {
      setSecurityStatus('connecting');
      
      // Initialize secure API client
      const apiInitialized = await secureApiClient.initialize();
      
      if (apiInitialized) {
        setBlockchainConnected(true);
        setSecurityStatus('connected');
        console.log('🔒 Blockchain security initialized successfully');
      } else {
        setBlockchainConnected(false);
        setSecurityStatus('fallback');
        console.warn('⚠️ Blockchain not available, using fallback security');
      }
    } catch (error) {
      console.error('❌ Security initialization failed:', error);
      setBlockchainConnected(false);
      setSecurityStatus('error');
    }
  };

  // Safe scroll lock for modal
  useEffect(() => {
    if (open && modalRef.current) {
      disableBodyScroll(modalRef.current, { allowTouchMove: el => el === modalRef.current });
      document.body.classList.add('scroll-locked');
      document.getElementById('root')?.classList.add('scroll-locked');
      document.querySelector('.App')?.classList.add('scroll-locked');
    } else if (modalRef.current) {
      enableBodyScroll(modalRef.current);
      document.body.classList.remove('scroll-locked');
      document.getElementById('root')?.classList.remove('scroll-locked');
      document.querySelector('.App')?.classList.remove('scroll-locked');
    }
    return () => {
      clearAllBodyScrollLocks();
      document.body.classList.remove('scroll-locked');
      document.getElementById('root')?.classList.remove('scroll-locked');
      document.querySelector('.App')?.classList.remove('scroll-locked');
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
      // Validate form data
      if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
        setErrorMsg('Please fill in all required fields (Name, Email, and Message).');
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        setErrorMsg('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      // Prepare enquiry data
      const enquiryData = {
        productName: form.product,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        message: form.message.trim()
      };

      // Send secure enquiry
      const result = await secureApiClient.sendSecureEnquiry(enquiryData);

      if (result.success) {
        setSuccessMsg(
          blockchainConnected 
            ? '🔒 Thank you! Your enquiry was received securely using blockchain technology. We will get back to you soon via email.'
            : 'Thank you! Your enquiry was received successfully. We will get back to you soon via email.'
        );
        setForm({ name: '', email: '', phone: '', product: '', city: '', message: '' });
        
        // Show additional info about email confirmation
        setTimeout(() => {
          setSuccessMsg(prev => prev + ' You will receive a confirmation email shortly.');
        }, 2000);
      } else {
        setErrorMsg('Failed to send enquiry. Please check your details and try again, or contact us directly at shri_industry@yahoo.com.');
      }
    } catch (err) {
      console.error('❌ Enquiry submission error:', err);
      
      if (err.message.includes('Rate limit exceeded')) {
        setErrorMsg('Too many requests. Please wait a moment before trying again.');
      } else if (err.message.includes('Blockchain not connected')) {
        setErrorMsg('Security connection failed. Please refresh the page and try again.');
      } else {
        setErrorMsg('Error sending enquiry. Please check your internet connection and try again, or contact us directly at shri_industry@yahoo.com.');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="contact-modal-overlay">
      <div className="contact-modal-content" ref={modalRef}>
        <button className="contact-modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="contact-modal-body">
          <div className="contact-modal-left">
            <h2 className="contact-modal-title">Contact us</h2>
            
            {/* Security Status Indicator */}
            <div className="security-status-indicator">
              {securityStatus === 'connected' && (
                <div className="security-status connected">
                  🔒 Blockchain Security Active
                </div>
              )}
              {securityStatus === 'fallback' && (
                <div className="security-status fallback">
                  ⚠️ Standard Security Mode
                </div>
              )}
              {securityStatus === 'connecting' && (
                <div className="security-status connecting">
                  🔄 Initializing Security...
                </div>
              )}
              {securityStatus === 'error' && (
                <div className="security-status error">
                  ❌ Security Error
                </div>
              )}
            </div>
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
        .security-status-indicator {
          margin-bottom: 20px;
        }
        .security-status {
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          text-align: center;
          margin-bottom: 10px;
        }
        .security-status.connected {
          background: #e8f5e8;
          color: #2d5a2d;
          border: 1px solid #4caf50;
        }
        .security-status.fallback {
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffc107;
        }
        .security-status.connecting {
          background: #e3f2fd;
          color: #1565c0;
          border: 1px solid #2196f3;
        }
        .security-status.error {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #f44336;
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