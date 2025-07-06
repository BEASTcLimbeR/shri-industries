import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ProductDetailsModal.css';

function ProductDetailsModal({ open, onClose, product, onEnquire = () => {} }) {
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

  function getProductSVG(name) {
    if (name === 'Areca Nut de-husking Machine') return process.env.PUBLIC_URL + '/areca-nut-de-husking-machine-svg.svg';
    if (name === 'Jackfruit chips cutting Machine') return process.env.PUBLIC_URL + '/jackfruit-chips-cutting-machine-svg.svg';
    if (name === 'Amla Shredding Machine') return process.env.PUBLIC_URL + '/amla-shredding-machine-svg.svg';
    if (name === 'Commercial Mini Chakli Machine') return process.env.PUBLIC_URL + '/commercial-mini-chakli-machine-svg.svg';
    return '';
  }

  return (
    <AnimatePresence>
      {open && product && (
        <div className="modal-overlay">
          <motion.div
            className="modal-content pixel-perfect-modal"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
            <div className="modal-img-container">
              <img className="modal-img" src={product.img} alt={product.name} />
            </div>
            <div className="modal-info">
              <div className="modal-title">{product.name}</div>
              <div className="modal-features">
                <div>Features:</div>
                <ul>
                  {product.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
              <div className="modal-actions">
                <button className="modal-btn" onClick={onEnquire}>Enquire now</button>
                {product.videoLink && (
                  <a href={product.videoLink} className="modal-btn modal-btn-secondary" target="_blank" rel="noopener noreferrer">Video</a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ProductDetailsModal; 