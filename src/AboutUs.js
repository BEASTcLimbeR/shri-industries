import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <section className="aboutus-section" id="about">
      <div className="aboutus-content">
        <h2 className="aboutus-title">About us</h2>
        <div className="aboutus-highlight">
          Leading manufacturers of reliable food and fruit processing machinery since <span className="aboutus-highlight-year">1996.</span>
        </div>
        <ul className="aboutus-features">
          <li><span className="aboutus-check">✅</span> 30+ years of industry experience</li>
          <li><span className="aboutus-check">✅</span> Trusted by food industries across India</li>
          <li><span className="aboutus-check">✅</span> In-house manufacturing for durability</li>
        </ul>
        <div className="aboutus-desc">
          <p>At Shri Industry Ichalkaranji, we've been manufacturing reliable food and fruit processing machinery since 1996. With nearly 30 years of experience, we specialize in innovative, user-friendly solutions that simplify operations for businesses across India.</p>
          <p>What started as a "fresh graduate's" idea to ease coconut shredding at home has evolved into a trusted brand powering food processing nationwide. We're committed to delivering quality, durability, and performance — helping industries grow with confidence.</p>
        </div>
      </div>
      <div className="aboutus-logo-gear">
        <img src={process.env.PUBLIC_URL + '/final-logo.svg'} alt="Shri Industry Logo" className="aboutus-logo" />
        {/* <div className="aboutus-gear aboutus-gear-large"></div>
        <div className="aboutus-gear aboutus-gear-small"></div> */}
      </div>
    </section>
  );
}

export default AboutUs; 