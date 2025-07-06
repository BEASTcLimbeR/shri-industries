import React, { useState, useEffect } from 'react';
import './Header.css';
import { motion, animate } from 'framer-motion';

function getInitialTheme() {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
  }
  return false; // default to light mode
}

function Header({ onHomeClick }) {
  const [darkMode, setDarkMode] = useState(getInitialTheme());
  const [menuOpen, setMenuOpen] = useState(false);

  // Sync body class and localStorage with darkMode state
  useEffect(() => {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(darkMode ? 'dark-mode' : 'light-mode');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    const audio = new Audio(process.env.PUBLIC_URL + '/toggle.mp3');
    audio.volume = 0.2;
    audio.play();
  };

  // Smooth scroll handler using Framer Motion
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    setMenuOpen(false); // Close menu on link click
    if (targetId === 'home' || targetId === '#home') {
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (onHomeClick) onHomeClick();
      return;
    }
    const section = document.getElementById(targetId);
    if (section) {
      const y = section.getBoundingClientRect().top + window.scrollY;
      animate(window.scrollY, y, {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1],
        onUpdate: (latest) => window.scrollTo(0, latest)
      });
    }
  };

  const handleHomeClick = (e) => {
    handleSmoothScroll(e, 'home');
    if (onHomeClick) onHomeClick();
  };

  return (
    <nav className="header-navbar">
      {/* Mobile Flex Row - Only visible on mobile */}
      <div className="navbar-mobile-row">
        <button
          className="header-hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen} // Accessibility: tells screen readers if menu is open
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`hamburger-bar${menuOpen ? ' open' : ''}`}></span>
          <span className={`hamburger-bar${menuOpen ? ' open' : ''}`}></span>
          <span className={`hamburger-bar${menuOpen ? ' open' : ''}`}></span>
        </button>
        <div className="header-logo">
          <img
            src={process.env.PUBLIC_URL + '/final-logo.svg'}
            alt="Shri Industry Logo"
          />
          <img
            src={process.env.PUBLIC_URL + '/company-logo-svg.svg'}
            alt="Shri Industry Text Logo"
            className="header-title-img"
            style={{ height: '40px', width: 'auto', marginLeft: '8px' }}
          />
        </div>
        <div className="header-darkmode-toggle" onClick={toggleTheme}>
          <div className={`toggle-switch ${darkMode ? 'dark' : 'light'}`}>
            <motion.div 
              className="toggle-thumb"
              animate={{
                x: darkMode ? 30 : 0,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
            >
              <div className="toggle-icon">
                {darkMode ? (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Links - Only render when menuOpen is true and on mobile */}
      {menuOpen && (
        <>
          {/* Backdrop for closing menu when clicking outside */}
          <div
            className="mobile-nav-backdrop"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            tabIndex={-1}
          />
          <ul className="header-navlinks mobile open">
            <li><a href="#home" onClick={handleHomeClick}>Home</a></li>
            <li><a href="#products" onClick={e => handleSmoothScroll(e, 'products')}>Products and Services</a></li>
            <li><a href="#about" onClick={e => handleSmoothScroll(e, 'about')}>About us</a></li>
            <li><a href="#contact" onClick={e => handleSmoothScroll(e, 'contact')}>Contact us</a></li>
          </ul>
        </>
      )}

      {/* Desktop Layout - Only visible on desktop */}
      <div className="navbar-desktop-row">
        <div className="header-logo">
          <img
            src={process.env.PUBLIC_URL + '/final-logo.svg'}
            alt="Shri Industry Logo"
          />
          <img
            src={process.env.PUBLIC_URL + '/company-logo-svg.svg'}
            alt="Shri Industry Text Logo"
            className="header-title-img"
            style={{ height: '56px', width: 'auto', marginLeft: '8px' }}
          />
        </div>
        <ul className="header-navlinks desktop">
          <li><a href="#home" onClick={handleHomeClick}>Home</a></li>
          <li><a href="#products" onClick={e => handleSmoothScroll(e, 'products')}>Products and Services</a></li>
          <li><a href="#about" onClick={e => handleSmoothScroll(e, 'about')}>About us</a></li>
          <li><a href="#contact" onClick={e => handleSmoothScroll(e, 'contact')}>Contact us</a></li>
        </ul>
        <div className="header-darkmode-toggle" onClick={toggleTheme}>
          <div className={`toggle-switch ${darkMode ? 'dark' : 'light'}`}>
            <motion.div 
              className="toggle-thumb"
              animate={{
                x: darkMode ? 30 : 0,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
            >
              <div className="toggle-icon">
                {darkMode ? (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
