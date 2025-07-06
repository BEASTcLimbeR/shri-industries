import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import HeroSection from './HeroSection';
import ProductCarousel from './ProductCarousel';
import BusinessInfoBar from './BusinessInfoBar';
import ProductsGrid from './ProductsGrid';
import OtherProducts from './OtherProducts';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import Footer from './Footer';
import ContactUsModal from './ContactUsModal';
import Preloader from './Preloader';

function App() {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading (replace with real data/image loading if needed)
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleEnquire = (product = '') => {
    setSelectedProduct(product);
    setContactModalOpen(true);
  };

  if (loading) return <Preloader />;

  return (
    <div className="App">
      <Header />
      <HeroSection />
      <ProductCarousel />
      <BusinessInfoBar />
      <ProductsGrid onEnquire={handleEnquire} />
      <OtherProducts onEnquire={handleEnquire} />
      <AboutUs />
      <ContactUs onEnquire={() => handleEnquire('')} />
      <Footer />
      <ContactUsModal open={contactModalOpen} onClose={() => { setContactModalOpen(false); setSelectedProduct(''); }} product={selectedProduct} />
    </div>
  );
}

export default App;
