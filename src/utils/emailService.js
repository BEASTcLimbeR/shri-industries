// Simple email service using Formspree (free service)
// This will work immediately without any setup

export const sendEnquiryEmail = async (formData) => {
  try {
    // Using Formspree - a free form handling service
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        product: formData.product || 'General enquiry',
        city: formData.city || 'Not provided',
        message: formData.message,
        _subject: `New Enquiry from ${formData.name}`,
        _replyto: formData.email,
      }),
    });

    if (response.ok) {
      return { success: true, message: 'Email sent successfully!' };
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Alternative: Using EmailJS (requires setup)
export const sendEnquiryEmailJS = async (formData, emailjsConfig) => {
  try {
    const emailjs = await import('@emailjs/browser');
    
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone || 'Not provided',
      product: formData.product || 'General enquiry',
      city: formData.city || 'Not provided',
      message: formData.message,
      to_email: 'shri_industry@yahoo.com'
    };

    emailjs.init(emailjsConfig.publicKey);
    
    const result = await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.templateId,
      templateParams
    );

    return { success: true, result };
  } catch (error) {
    console.error('EmailJS error:', error);
    throw error;
  }
};
