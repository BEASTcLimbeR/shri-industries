import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './ProductCarousel.css';

const products = [
  {
    name: 'Areca Nut de-husking Machine',
    img: '/areca-nut-dehusking-machine-photo.png',
  },
  {
    name: 'Jackfruit chips cutting Machine',
    img: '/jackfruit-chips-cutting-machine-photo.png',
  },
  {
    name: 'Amla Shredding Machine',
    img: '/amla-shredding-machine-photo.png',
  },
  {
    name: 'Commercial Mini Chakli Machine',
    img: '/commercial-mini-chakli-machine-photo.png',
  },
];

const SLIDES_COUNT = 2; // Only two slides

function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
  const containerRef = useRef();

  // Update isMobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // For desktop: 2 slides (3 products per slide); for mobile: 4 slides (1 product per slide)
  const maxIndex = isMobile ? products.length - 1 : 1;

  // Slide to next
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  // Slide to previous
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, maxIndex, isMobile]);

  // Touch/Mouse drag support
  useEffect(() => {
    const container = containerRef.current;
    let startX = 0;
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) nextSlide();
      if (endX - startX > 50) prevSlide();
    };
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [maxIndex, isMobile]);

  // Get the visible cards for each slide
  let visibleCards;
  if (isMobile) {
    visibleCards = [products[currentIndex]];
  } else {
    if (currentIndex === 0) {
      visibleCards = products.slice(0, 3); // First 3 products
    } else {
      // Second slide: last product + first two (wrap around)
      visibleCards = [products[3], products[0], products[1]];
    }
  }

  // Scroll to 'Our Products' section
  const handleImageClick = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="carousel-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={containerRef}
    >
      {/* Glassmorphism Previous Button */}
      <button
        className="carousel-glass-btn prev"
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        &#8592;
      </button>
      <div className="carousel-cards">
        {visibleCards.map((product) => (
          <div className="carousel-card" key={product.name}>
            <img src={product.img} alt={product.name} onClick={handleImageClick} style={{ cursor: 'pointer' }} />
            <button className="carousel-card-btn">{product.name}</button>
          </div>
        ))}
      </div>
      {/* Glassmorphism Next Button */}
      <button
        className="carousel-glass-btn next"
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        &#8594;
      </button>
      <div className="carousel-dots">
        {(isMobile ? products : [0, 1]).map((_, i) => (
          <span
            key={i}
            className={`dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductCarousel;
