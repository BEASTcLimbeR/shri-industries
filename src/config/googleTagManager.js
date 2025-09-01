// Google Tag Manager Configuration
// This provides more advanced tracking capabilities than basic GA4

export const GTM_CONFIG = {
  // Your Google Tag Manager Container ID (starts with GTM-)
  CONTAINER_ID: 'GTM_CONTAINER_ID',
  
  // Data layer name (default is 'dataLayer')
  DATA_LAYER_NAME: 'dataLayer',
  
  // Custom events for your business
  EVENTS: {
    // Product interactions
    PRODUCT_VIEW: 'product_view',
    PRODUCT_INQUIRY: 'product_inquiry',
    PRODUCT_DOWNLOAD: 'product_download',
    
    // Contact interactions
    PHONE_CLICK: 'phone_click',
    EMAIL_CLICK: 'email_click',
    WHATSAPP_CLICK: 'whatsapp_click',
    
    // Form interactions
    CONTACT_FORM_SUBMIT: 'contact_form_submit',
    ENQUIRY_FORM_SUBMIT: 'enquiry_form_submit',
    
    // Page interactions
    SCROLL_DEPTH: 'scroll_depth',
    TIME_ON_PAGE: 'time_on_page',
    
    // Business specific events
    MACHINE_INQUIRY: 'machine_inquiry',
    CATALOG_DOWNLOAD: 'catalog_download',
    VIDEO_PLAY: 'video_play'
  }
};

// Initialize Google Tag Manager
export const initGTM = () => {
  if (typeof window !== 'undefined') {
    // Create data layer
    window[GTM_CONFIG.DATA_LAYER_NAME] = window[GTM_CONFIG.DATA_LAYER_NAME] || [];
    
    // Push initial data
    window[GTM_CONFIG.DATA_LAYER_NAME].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
  }
};

// Push data to GTM data layer
export const pushToDataLayer = (data) => {
  if (typeof window !== 'undefined' && window[GTM_CONFIG.DATA_LAYER_NAME]) {
    window[GTM_CONFIG.DATA_LAYER_NAME].push(data);
  }
};

// Track product views with detailed information
export const trackProductView = (productData) => {
  pushToDataLayer({
    event: GTM_CONFIG.EVENTS.PRODUCT_VIEW,
    product_name: productData.name,
    product_category: productData.category,
    product_price: productData.price,
    product_id: productData.id,
    page_location: window.location.href
  });
};

// Track contact form submissions
export const trackContactFormSubmit = (formData) => {
  pushToDataLayer({
    event: GTM_CONFIG.EVENTS.CONTACT_FORM_SUBMIT,
    form_name: formData.formName,
    user_email: formData.email, // Be careful with PII
    user_location: formData.location,
    page_location: window.location.href
  });
};

// Track machine inquiries (specific to your business)
export const trackMachineInquiry = (machineData) => {
  pushToDataLayer({
    event: GTM_CONFIG.EVENTS.MACHINE_INQUIRY,
    machine_name: machineData.name,
    machine_type: machineData.type,
    inquiry_source: machineData.source,
    user_location: machineData.userLocation,
    page_location: window.location.href
  });
};

// Track scroll depth
export const trackScrollDepth = (depth) => {
  pushToDataLayer({
    event: GTM_CONFIG.EVENTS.SCROLL_DEPTH,
    scroll_depth: depth,
    page_location: window.location.href
  });
};

// Track time on page
export const trackTimeOnPage = (timeInSeconds) => {
  pushToDataLayer({
    event: GTM_CONFIG.EVENTS.TIME_ON_PAGE,
    time_on_page: timeInSeconds,
    page_location: window.location.href
  });
};
