import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import './ProductDetailsModal.css';

function ProductDetailsModal({ open, onClose, product, onEnquire = () => {} }) {
  const modalRef = useRef();

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

  return (
    <AnimatePresence>
      {open && product && (
        <div className="modal-overlay">
          <motion.div
            className="modal-content pixel-perfect-modal"
            ref={modalRef}
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