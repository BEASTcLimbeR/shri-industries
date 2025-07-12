import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './ProductsGrid.css';
import ProductDetailsModal from './ProductDetailsModal';

const products = [
  {
    name: 'Areca Nut de-husking Machine',
    img: process.env.PUBLIC_URL + '/areca-nut-dehusking-machine-photo.png',
    features: [
      'Motor 1 HP single phase',
      'Capacity: 40 kg/hr.',
      'Peels Areca nut of all sizes',
      'No need of grading at time of feeding.',
      'Less breakage of Areca nuts.'
    ],
    videoLink: 'https://youtu.be/TFuE4XoymrM?si=bYliTFjAGNKnypWj',
  },
  {
    name: 'Jackfruit chips cutting Machine',
    img: process.env.PUBLIC_URL + '/jackfruit-chips-cutting-machine-photo.png',
    features: [
      'Motorized operation',
      'Uniform chip size',
      'Easy to clean',
      'Stainless steel blades',
      'High output capacity'
    ],
    videoLink: 'https://youtu.be/bZJqtuN0dNA?si=ZZeHcRZb-zU5Lb2s',
  },
  {
    name: 'Amla Shredding Machine',
    img: process.env.PUBLIC_URL + '/amla-shredding-machine-photo.png',
    features: [
      'Efficient shredding',
      'Low maintenance',
      'Suitable for all sizes',
      'Easy operation',
      'Durable build'
    ],
    videoLink: '',
  },
  {
    name: 'Commercial Mini Chakli Machine',
    img: process.env.PUBLIC_URL + '/commercial-mini-chakli-machine-photo.png',
    features: [
      'Compact design',
      'High efficiency',
      'Easy to operate',
      'Consistent output',
      'Low power consumption'
    ],
    videoLink: 'https://youtu.be/ussDIA6N16Y?si=H3d2X3-n674zdPcW',
  },
];

function ProductsGrid({ onEnquire = () => {} }) {
  const [modalIdx, setModalIdx] = useState(null);
  const [highlighted, setHighlighted] = useState('');
  const highlightTimeout = useRef();

  // Expose a global function for the carousel to call
  window.scrollToProductCard = (productName) => {
    const id = `product-${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const productCard = document.getElementById(id);
    if (productCard) {
      productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlighted(id);
      clearTimeout(highlightTimeout.current);
      highlightTimeout.current = setTimeout(() => setHighlighted(''), 1500);
    }
  };

  return (
    <section className="products-section" id="products">
      <h2 className="products-title">Our Products</h2>
      <div className="products-grid">
        {products.map((product, idx) => {
          const id = `product-${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          const isHighlighted = highlighted === id;
          return (
          <motion.div
            className="product-card pixel-perfect"
              id={id}
            key={product.name}
            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(255,153,0,0.25)' }}
              animate={isHighlighted ? { scale: 1.04, boxShadow: '0 8px 32px rgba(255,153,0,0.25)' } : { scale: 1, boxShadow: '0 4px 24px rgba(0,0,0,0.13)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Card Header: Logo and Company Name */}
            <div className="product-card-header">
              <img src={process.env.PUBLIC_URL + '/final-logo.svg'} alt="Shri Industry Logo" className="product-card-logo" />
              <span className="product-card-company">Shri Industry, Ichalakaranji</span>
            </div>
            {/* Product Name */}
            <div className="product-card-title">{product.name}</div>
            {/* Product Image */}
            <div className="product-img-container">
              <img
                src={product.img}
                alt={product.name}
                className={`product-card-img${product.name === 'Amla Shredding Machine' || product.name === 'Commercial Mini Chakli Machine' ? ' extra-zoom' : ''}`}
              />
            </div>
            {/* View Details Button (functionality unchanged) */}
            <motion.button
              className="product-details-btn"
              onClick={() => setModalIdx(idx)}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 16px rgba(25,118,255,0.18)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              View Details
            </motion.button>
          </motion.div>
          );
        })}
      </div>
      <ProductDetailsModal
        open={modalIdx !== null}
        onClose={() => setModalIdx(null)}
        product={modalIdx !== null ? products[modalIdx] : null}
        onEnquire={() => {
          if (modalIdx !== null) onEnquire(products[modalIdx].name);
        }}
      />
    </section>
  );
}

export default ProductsGrid; 