// Google Analytics 4 Configuration
// Replace these placeholder values with your actual Google Analytics data

export const GA_CONFIG = {
  // Your Google Analytics Measurement ID (starts with G-)
  MEASUREMENT_ID: 'GA_MEASUREMENT_ID',
  
  // Your Google Search Console verification code
  SEARCH_CONSOLE_VERIFICATION: 'YOUR_VERIFICATION_CODE',
  
  // Custom dimensions for better tracking
  CUSTOM_DIMENSIONS: {
    USER_TYPE: 'user_type',
    PRODUCT_CATEGORY: 'product_category',
    PAGE_SECTION: 'page_section'
  },
  
  // Event tracking configuration
  EVENTS: {
    PAGE_VIEW: 'page_view',
    BUTTON_CLICK: 'button_click',
    FORM_SUBMIT: 'form_submit',
    PRODUCT_VIEW: 'product_view',
    CONTACT_CLICK: 'contact_click'
  }
};

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_CONFIG.MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true
    });
  }
};

// Track custom events
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Track page views for React Router
export const trackPageView = (pagePath) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_CONFIG.MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: document.title
    });
  }
};

// Track form submissions
export const trackFormSubmit = (formName) => {
  trackEvent(GA_CONFIG.EVENTS.FORM_SUBMIT, {
    form_name: formName,
    page_location: window.location.href
  });
};

// Track product views
export const trackProductView = (productName, productCategory) => {
  trackEvent(GA_CONFIG.EVENTS.PRODUCT_VIEW, {
    product_name: productName,
    product_category: productCategory,
    page_location: window.location.href
  });
};

// Track contact button clicks
export const trackContactClick = (contactMethod) => {
  trackEvent(GA_CONFIG.EVENTS.CONTACT_CLICK, {
    contact_method: contactMethod,
    page_location: window.location.href
  });
};
