require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Enquiry = require('./models/Enquiry');
const backendBlockchainSecurity = require('./utils/blockchainSecurity');
const SecurityMiddleware = require('./middleware/securityMiddleware');
const securityConfig = require('./config/security');

const app = express();

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://polygon-mumbai.g.alchemy.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration with security
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Security-Token', 'X-User-Address', 'X-Timestamp', 'X-Nonce']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Comprehensive security middleware
app.use(SecurityMiddleware.logRequest);
app.use(SecurityMiddleware.validateRequest);
app.use(SecurityMiddleware.addSecurityHeaders);
app.use(SecurityMiddleware.validateBlockchainSecurity);
app.use(SecurityMiddleware.blockchainRateLimit);
app.use(SecurityMiddleware.validateData);

console.log('MONGO_URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected!'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Server will start but MongoDB features will not work until MongoDB is running.');
});

app.post('/send-enquiry', async (req, res) => {
  try {
    // Validate security token
    let securityContext = null;
    try {
      securityContext = await backendBlockchainSecurity.validateSecurityToken(req);
      backendBlockchainSecurity.logSecurityEvent('ENQUIRY_REQUEST', {
        userAddress: securityContext.userAddress,
        ip: req.ip,
        timestamp: securityContext.timestamp
      });
    } catch (securityError) {
      console.warn('⚠️ Security validation failed:', securityError.message);
      // Allow request to proceed but log the event
      backendBlockchainSecurity.logSecurityEvent('SECURITY_VALIDATION_FAILED', {
        error: securityError.message,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
    }

    // Decrypt sensitive data
    const decryptedData = backendBlockchainSecurity.decryptEnquiryData(req.body);
    const { productName, name, email, message, phone, city } = decryptedData;

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

    // Configure transporter using environment variables
    let transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Create comprehensive message
    const fullMessage = `Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
City: ${city || 'Not provided'}
Product: ${productName || 'General enquiry'}
Message: ${message}

Security Information:
- Request Time: ${new Date().toISOString()}
- User Address: ${securityContext?.userAddress || 'Not connected'}
- IP Address: ${req.ip}
- User Agent: ${req.get('User-Agent')}`;

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `🔒 Secure Enquiry for ${productName || 'General'} - Shri Industries`,
      text: fullMessage,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976ed;">🔒 Secure Enquiry - Shri Industries</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Customer Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>City:</strong> ${city || 'Not provided'}</p>
            <p><strong>Product:</strong> ${productName || 'General enquiry'}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-left: 4px solid #1976ed; margin: 10px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; font-size: 12px; color: #666;">
            <h4 style="margin-top: 0; color: #1976ed;">🔐 Security Information</h4>
            <p><strong>Request Time:</strong> ${new Date().toISOString()}</p>
            <p><strong>User Address:</strong> ${securityContext?.userAddress || 'Not connected'}</p>
            <p><strong>IP Address:</strong> ${req.ip}</p>
            <p><strong>User Agent:</strong> ${req.get('User-Agent')}</p>
          </div>
        </div>
      `
    };

    // Thank you email to the user
    let thankYouMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔒 Thank You for Your Secure Enquiry – Shri Industries',
      text: `Dear ${name},\n\nThank you for reaching out to Shri Industries!\n\nWe've received your enquiry and truly appreciate your interest in our products. We will get in touch with you shortly with the details you requested.\n\nIf you have any additional questions or need urgent assistance, feel free to contact us at +91 9322663649 or reply to this email.\n\nWe look forward to helping you find the perfect solution for your needs.\n\nWarm regards,\nShri Industries\n📞+91 9322663649 | ✉️ shri.industryich@gmail.com | 📍17/141 Gurukripa, Vivekanand Colony Ichalkaranji Pin code: 416115`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976ed;">🔒 Thank You for Your Enquiry!</h2>
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to Shri Industries!</p>
          <p>We've received your enquiry and truly appreciate your interest in our products. We will get in touch with you shortly with the details you requested.</p>
          <p>If you have any additional questions or need urgent assistance, feel free to contact us at +91 9322663649 or reply to this email.</p>
          <p>We look forward to helping you find the perfect solution for your needs.</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
            <p>📞 <strong>Phone:</strong> +91 9322663649</p>
            <p>✉️ <strong>Email:</strong> shri.industryich@gmail.com</p>
            <p>📍 <strong>Address:</strong> 17/141 Gurukripa, Vivekanand Colony<br>Ichalkaranji Pin code: 416115</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This message was sent securely using blockchain technology to ensure your privacy and data integrity.
          </p>
        </div>
      `
    };

    // Save to MongoDB first (fast response)
    const enquiryData = {
      ...decryptedData,
      securityContext: {
        userAddress: securityContext?.userAddress,
        ip: req.ip,
        timestamp: securityContext?.timestamp,
        nonce: securityContext?.nonce
      },
      createdAt: new Date(),
      emailStatus: 'pending' // Track email sending status
    };

    const enquiry = new Enquiry(enquiryData);
    await enquiry.save();
    console.log('🔒 Enquiry saved to MongoDB:', enquiry._id);

    // Send response immediately (don't wait for emails)
    const response = await backendBlockchainSecurity.createSecureResponse(
      { 
        message: 'Enquiry received successfully! We will get back to you soon.', 
        enquiryId: enquiry._id,
        status: 'received'
      },
      securityContext?.userAddress
    );

    res.status(200).json(response);

    // Send emails asynchronously (don't block the response)
    setImmediate(async () => {
      try {
        console.log('📧 Starting email sending process...');
        
        // Send to admin
        let adminResult = await transporter.sendMail(mailOptions);
        console.log('🔒 Admin email sent:', adminResult.response);

        // Send thank you to user
        let userResult = await transporter.sendMail(thankYouMailOptions);
        console.log('🔒 Thank you email sent:', userResult.response);

        // Update enquiry status
        await Enquiry.findByIdAndUpdate(enquiry._id, { 
          emailStatus: 'sent',
          emailSentAt: new Date()
        });
        
        console.log('✅ Email sending completed for enquiry:', enquiry._id);
      } catch (emailError) {
        console.error('❌ Email sending failed for enquiry:', enquiry._id, emailError);
        
        // Update enquiry status to failed
        await Enquiry.findByIdAndUpdate(enquiry._id, { 
          emailStatus: 'failed',
          emailError: emailError.message
        });
      }
    });

  } catch (err) {
    console.error('❌ Error processing enquiry:', err);
    backendBlockchainSecurity.logSecurityEvent('ENQUIRY_ERROR', {
      error: err.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to process enquiry. Please try again or contact us directly.' 
    });
  }
});

// API endpoint to get all enquiries
app.get('/api/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Example: API endpoint for email stats
app.get('/api/email-stats', async (req, res) => {
  try {
    // Replace with your logic to get real stats
    const totalEmailsSent = 12361;
    const percentChange = 14;
    
    const response = await backendBlockchainSecurity.createSecureResponse(
      { totalEmailsSent, percentChange },
      req.securityContext?.userAddress
    );
    
    res.json(response);
  } catch (error) {
    console.error('❌ Email stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve email statistics'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    security: {
      blockchain: backendBlockchainSecurity.provider ? 'connected' : 'disconnected',
      encryption: 'enabled',
      rateLimit: 'active'
    }
  });
});

// Security status endpoint
app.get('/security-status', (req, res) => {
  res.json({
    security: {
      blockchain: {
        connected: !!backendBlockchainSecurity.provider,
        chainId: securityConfig.blockchain.chainId
      },
      encryption: {
        enabled: true,
        algorithm: securityConfig.encryption.algorithm
      },
      rateLimit: {
        enabled: securityConfig.rateLimit.blockchainRateLimit.enabled,
        maxRequests: securityConfig.rateLimit.blockchainRateLimit.maxRequests
      },
      headers: {
        csp: 'enabled',
        hsts: 'enabled',
        xss: 'enabled'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use(SecurityMiddleware.handleSecurityErrors);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔒 Secure server running on port ${PORT}`);
  console.log(`🔗 Blockchain security: ${backendBlockchainSecurity.provider ? 'Connected' : 'Fallback mode'}`);
  console.log(`🛡️  Security features: Encryption, Rate Limiting, Data Validation, Blockchain Auth`);
}); 