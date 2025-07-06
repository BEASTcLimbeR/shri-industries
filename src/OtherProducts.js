import React from 'react';
import './OtherProducts.css';

const otherProducts = [
  'Grain Destoner',
  'Banana chips machine',
  'Mango Pulper',
  'Khoya making machine',
  'Dough kneading machine',
  'Coconut De-husking machine',
  'Boiled amla breaking machine',
];

function OtherProducts({ onEnquire = () => {} }) {
  return (
    <section className="other-products-section">
      <h2 className="other-products-title">Other Products</h2>
      <div className="other-products-grid">
        {otherProducts.map((name, idx) => (
          <div className="other-product-card" key={name}>
            <div className="other-product-name">{name}</div>
            <button className="other-product-btn" onClick={() => onEnquire(name)}>Send Enquiry</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OtherProducts; 