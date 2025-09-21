/**
 * Comprehensive Security Middleware
 * This middleware provides multiple layers of security protection
 */

const securityConfig = require('../config/security');
const backendBlockchainSecurity = require('../utils/blockchainSecurity');

class SecurityMiddleware {
  /**
   * Request validation middleware
   * Validates incoming requests for security compliance
   */
  static validateRequest(req, res, next) {
    try {
      // Check request method
      if (!securityConfig.requestValidation.allowedMethods.includes(req.method)) {
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
      }

      // Check request size
      const contentLength = parseInt(req.get('Content-Length') || '0');
      if (contentLength > securityConfig.requestValidation.maxRequestSize) {
        return res.status(413).json({
          success: false,
          error: 'Request too large'
        });
      }

      // Check required headers
      for (const header of securityConfig.requestValidation.requiredHeaders) {
        if (!req.get(header)) {
          return res.status(400).json({
            success: false,
            error: `Missing required header: ${header}`
          });
        }
      }

      // Log request
      if (securityConfig.logging.requestLogging) {
        console.log(`🔍 Request: ${req.method} ${req.path} from ${req.ip}`);
      }

      next();
    } catch (error) {
      console.error('❌ Request validation error:', error);
      res.status(400).json({
        success: false,
        error: 'Invalid request'
      });
    }
  }

  /**
   * Data validation middleware
   * Validates and sanitizes request data
   */
  static validateData(req, res, next) {
    try {
      // Validate email if present
      if (req.body.email) {
        const emailRegex = securityConfig.validation.email.regex;
        if (!emailRegex.test(req.body.email)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid email format'
          });
        }
        if (req.body.email.length > securityConfig.validation.email.maxLength) {
          return res.status(400).json({
            success: false,
            error: 'Email too long'
          });
        }
      }

      // Validate name if present
      if (req.body.name) {
        const name = req.body.name.trim();
        if (name.length < securityConfig.validation.name.minLength) {
          return res.status(400).json({
            success: false,
            error: 'Name too short'
          });
        }
        if (name.length > securityConfig.validation.name.maxLength) {
          return res.status(400).json({
            success: false,
            error: 'Name too long'
          });
        }
        const nameRegex = securityConfig.validation.name.regex;
        if (!nameRegex.test(name)) {
          return res.status(400).json({
            success: false,
            error: 'Name contains invalid characters'
          });
        }
        req.body.name = name; // Sanitized name
      }

      // Validate phone if present
      if (req.body.phone) {
        const phoneRegex = securityConfig.validation.phone.regex;
        if (!phoneRegex.test(req.body.phone)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid phone number format'
          });
        }
        if (req.body.phone.length > securityConfig.validation.phone.maxLength) {
          return res.status(400).json({
            success: false,
            error: 'Phone number too long'
          });
        }
      }

      // Validate message if present
      if (req.body.message) {
        const message = req.body.message.trim();
        if (message.length < securityConfig.validation.message.minLength) {
          return res.status(400).json({
            success: false,
            error: 'Message too short'
          });
        }
        if (message.length > securityConfig.validation.message.maxLength) {
          return res.status(400).json({
            success: false,
            error: 'Message too long'
          });
        }
        req.body.message = message; // Sanitized message
      }

      // Validate city if present
      if (req.body.city) {
        const city = req.body.city.trim();
        if (city.length > securityConfig.validation.city.maxLength) {
          return res.status(400).json({
            success: false,
            error: 'City name too long'
          });
        }
        const cityRegex = securityConfig.validation.city.regex;
        if (!cityRegex.test(city)) {
          return res.status(400).json({
            success: false,
            error: 'City name contains invalid characters'
          });
        }
        req.body.city = city; // Sanitized city
      }

      next();
    } catch (error) {
      console.error('❌ Data validation error:', error);
      res.status(400).json({
        success: false,
        error: 'Data validation failed'
      });
    }
  }

  /**
   * Security headers middleware
   * Adds comprehensive security headers
   */
  static addSecurityHeaders(req, res, next) {
    try {
      // Add security headers
      Object.entries(securityConfig.securityHeaders.additionalHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      // Add custom security headers
      res.setHeader('X-Security-Version', '1.0');
      res.setHeader('X-Request-ID', generateRequestId());
      res.setHeader('X-Timestamp', Date.now().toString());

      next();
    } catch (error) {
      console.error('❌ Security headers error:', error);
      next();
    }
  }

  /**
   * Blockchain security middleware
   * Validates blockchain security tokens
   */
  static async validateBlockchainSecurity(req, res, next) {
    try {
      // Skip validation for certain endpoints
      const skipEndpoints = ['/health', '/status'];
      if (skipEndpoints.includes(req.path)) {
        return next();
      }

      // Check if security token is present
      const securityToken = req.headers['x-security-token'];
      if (!securityToken) {
        // Log security event
        backendBlockchainSecurity.logSecurityEvent('MISSING_SECURITY_TOKEN', {
          ip: req.ip,
          path: req.path,
          userAgent: req.get('User-Agent')
        });
        
        // Allow request to proceed but log the event
        return next();
      }

      // Validate security token
      try {
        const securityContext = await backendBlockchainSecurity.validateSecurityToken(req);
        req.securityContext = securityContext;
        
        // Log successful validation
        backendBlockchainSecurity.logSecurityEvent('SECURITY_TOKEN_VALIDATED', {
          userAddress: securityContext.userAddress,
          ip: req.ip,
          path: req.path
        });
      } catch (validationError) {
        // Log validation failure
        backendBlockchainSecurity.logSecurityEvent('SECURITY_TOKEN_VALIDATION_FAILED', {
          error: validationError.message,
          ip: req.ip,
          path: req.path,
          userAgent: req.get('User-Agent')
        });
        
        // Allow request to proceed but log the event
        req.securityContext = null;
      }

      next();
    } catch (error) {
      console.error('❌ Blockchain security validation error:', error);
      req.securityContext = null;
      next();
    }
  }

  /**
   * Rate limiting middleware
   * Implements blockchain-based rate limiting
   */
  static async blockchainRateLimit(req, res, next) {
    try {
      if (!securityConfig.rateLimit.blockchainRateLimit.enabled) {
        return next();
      }

      const userAddress = req.headers['x-user-address'] || req.ip;
      const now = Date.now();
      const windowMs = securityConfig.rateLimit.blockchainRateLimit.windowMs;
      const maxRequests = securityConfig.rateLimit.blockchainRateLimit.maxRequests;

      // Check rate limit
      const isAllowed = backendBlockchainSecurity.checkRateLimit(userAddress, req.ip);
      
      if (!isAllowed) {
        backendBlockchainSecurity.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
          userAddress,
          ip: req.ip,
          path: req.path
        });
        
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded. Please wait before making another request.',
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }

      next();
    } catch (error) {
      console.error('❌ Rate limiting error:', error);
      next();
    }
  }

  /**
   * Error handling middleware
   * Handles security-related errors
   */
  static handleSecurityErrors(err, req, res, next) {
    try {
      // Log security error
      backendBlockchainSecurity.logSecurityEvent('SECURITY_ERROR', {
        error: err.message,
        stack: err.stack,
        ip: req.ip,
        path: req.path,
        userAgent: req.get('User-Agent')
      });

      // Don't expose internal errors
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Data validation failed',
          details: isDevelopment ? err.message : undefined
        });
      }

      if (err.name === 'RateLimitError') {
        return res.status(429).json({
          success: false,
          error: 'Too many requests. Please try again later.'
        });
      }

      if (err.name === 'SecurityError') {
        return res.status(403).json({
          success: false,
          error: 'Security validation failed'
        });
      }

      // Generic error response
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: isDevelopment ? err.message : undefined
      });
    } catch (error) {
      console.error('❌ Error handling middleware error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Request logging middleware
   * Logs all requests for security monitoring
   */
  static logRequest(req, res, next) {
    try {
      if (securityConfig.logging.requestLogging) {
        const startTime = Date.now();
        
        res.on('finish', () => {
          const duration = Date.now() - startTime;
          const logData = {
            method: req.method,
            path: req.path,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            statusCode: res.statusCode,
            duration: duration,
            timestamp: new Date().toISOString(),
            userAddress: req.securityContext?.userAddress
          };
          
          console.log('📊 Request Log:', JSON.stringify(logData, null, 2));
        });
      }
      
      next();
    } catch (error) {
      console.error('❌ Request logging error:', error);
      next();
    }
  }
}

/**
 * Generate unique request ID
 */
function generateRequestId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

module.exports = SecurityMiddleware;
