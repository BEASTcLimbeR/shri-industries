require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Send enquiry endpoint
app.post('/send-enquiry', async (req, res) => {
  try {
    const { name, email, phone, product, city, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Create email content
    const adminEmailContent = `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Product: ${product || 'General enquiry'}
City: ${city || 'Not provided'}

Message:
${message}

---
This enquiry was sent from the Shri Industries website contact form.
    `.trim();

    // Send email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Enquiry from ${name} - ${product || 'General Enquiry'}`,
      text: adminEmailContent
    };

    // Send thank you email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank You for Your Enquiry – Shri Industries',
      text: `Dear ${name},

Thank you for reaching out to Shri Industries!

We've received your enquiry and truly appreciate your interest in our products. We will get in touch with you shortly with the details you requested.

If you have any additional questions or need urgent assistance, feel free to contact us at +91 9322663649 or reply to this email.

We look forward to helping you find the perfect solution for your needs.

Warm regards,
Shri Industries
📞+91 9322663649 | ✉️ shri.industryich@gmail.com | 📍17/141 Gurukripa, Vivekanand Colony Ichalkaranji Pin code: 416115`
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);

    res.json({
      success: true,
      message: 'Enquiry sent successfully'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send enquiry. Please try again later.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email configured for: ${process.env.EMAIL_USER}`);
});
