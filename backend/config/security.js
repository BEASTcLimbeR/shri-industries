/**
 * Comprehensive Security Configuration
 * This file contains all security settings and configurations
 */

const securityConfig = {
  // Blockchain Configuration
  blockchain: {
    chainId: 80001, // Polygon Mumbai testnet
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'https://polygon-mumbai.g.alchemy.com/v2/demo',
    contractAddress: process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    encryptionKey: process.env.ENCRYPTION_KEY || 'shri-industries-secure-key-2024'
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    // Blockchain-based rate limiting
    blockchainRateLimit: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10,
      enabled: true
    }
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Security-Token',
      'X-User-Address',
      'X-Timestamp',
      'X-Nonce',
      'X-Data-Hash',
      'X-Signature'
    ]
  },

  // Security Headers Configuration
  securityHeaders: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://polygon-mumbai.g.alchemy.com",
          "https://ipfs.io"
        ],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    additionalHeaders: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-DNS-Prefetch-Control': 'off'
    }
  },

  // Data Validation Configuration
  validation: {
    email: {
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxLength: 254
    },
    name: {
      minLength: 2,
      maxLength: 100,
      regex: /^[a-zA-Z\s\u00C0-\u017F]+$/
    },
    phone: {
      regex: /^[\+]?[1-9][\d]{0,15}$/,
      maxLength: 20
    },
    message: {
      minLength: 10,
      maxLength: 2000
    },
    city: {
      maxLength: 100,
      regex: /^[a-zA-Z\s\u00C0-\u017F]+$/
    }
  },

  // Encryption Configuration
  encryption: {
    algorithm: 'aes-256-cbc',
    keyLength: 32,
    ivLength: 16,
    saltRounds: 12
  },

  // Request Validation Configuration
  requestValidation: {
    maxRequestAge: 300, // 5 minutes in seconds
    maxRequestSize: 10 * 1024 * 1024, // 10MB
    allowedMethods: ['GET', 'POST', 'OPTIONS'],
    requiredHeaders: ['Content-Type', 'X-Requested-With']
  },

  // Logging Configuration
  logging: {
    securityEvents: true,
    requestLogging: true,
    errorLogging: true,
    logLevel: process.env.LOG_LEVEL || 'info'
  },

  // IP Whitelist/Blacklist Configuration
  ipFiltering: {
    enabled: false,
    whitelist: [],
    blacklist: [],
    maxConnectionsPerIP: 50
  },

  // Session Security Configuration
  session: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },

  // Database Security Configuration
  database: {
    connectionTimeout: 30000,
    queryTimeout: 10000,
    maxConnections: 10,
    enableSSL: true
  },

  // Email Security Configuration
  email: {
    secure: true,
    requireTLS: true,
    rateLimit: {
      maxEmailsPerHour: 50,
      maxEmailsPerDay: 500
    }
  },

  // Monitoring Configuration
  monitoring: {
    enableMetrics: true,
    enableAlerts: true,
    alertThresholds: {
      errorRate: 0.05, // 5%
      responseTime: 5000, // 5 seconds
      memoryUsage: 0.8 // 80%
    }
  }
};

module.exports = securityConfig;
