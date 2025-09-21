/**
 * Backend Blockchain Security Utilities
 * This file provides server-side blockchain security features
 */

const { ethers } = require('ethers');
const CryptoJS = require('crypto-js');

// Configuration for blockchain security
const BLOCKCHAIN_CONFIG = {
  CHAIN_ID: 80001, // Polygon Mumbai
  RPC_URL: process.env.BLOCKCHAIN_RPC_URL || 'https://polygon-mumbai.g.alchemy.com/v2/demo',
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'shri-industries-secure-key-2024',
  MAX_REQUEST_AGE: 300, // 5 minutes in seconds
  RATE_LIMIT_WINDOW: 60000, // 1 minute in milliseconds
  MAX_REQUESTS_PER_WINDOW: 10
};

class BackendBlockchainSecurity {
  constructor() {
    this.provider = null;
    this.rateLimitStore = new Map();
    this.initializeProvider();
  }

  /**
   * Initialize blockchain provider
   */
  async initializeProvider() {
    try {
      this.provider = new ethers.JsonRpcProvider(BLOCKCHAIN_CONFIG.RPC_URL);
      console.log('🔗 Backend blockchain provider initialized');
    } catch (error) {
      console.error('❌ Backend blockchain provider initialization failed:', error);
    }
  }

  /**
   * Decrypt sensitive data
   */
  decryptData(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, BLOCKCHAIN_CONFIG.ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      console.error('❌ Decryption failed:', error);
      throw new Error('Data decryption failed');
    }
  }

  /**
   * Decrypt enquiry data
   */
  decryptEnquiryData(data) {
    try {
      const decryptedData = { ...data };
      
      // Decrypt sensitive fields
      const sensitiveFields = ['email', 'phone', 'message', 'name'];
      sensitiveFields.forEach(field => {
        if (decryptedData[field] && typeof decryptedData[field] === 'string') {
          try {
            decryptedData[field] = this.decryptData(decryptedData[field]);
          } catch (error) {
            // If decryption fails, keep original value (might not be encrypted)
            console.warn(`⚠️ Field ${field} decryption failed, using original value`);
          }
        }
      });
      
      return decryptedData;
    } catch (error) {
      console.error('❌ Enquiry data decryption failed:', error);
      return data; // Return original data as fallback
    }
  }

  /**
   * Verify blockchain signature
   */
  async verifySignature(data, signature, expectedAddress) {
    try {
      if (!this.provider) {
        console.warn('⚠️ Blockchain provider not available, skipping signature verification');
        return true; // Allow request to proceed
      }

      // Recreate the hash
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(data)));
      
      // Recover the address from the signature
      const recoveredAddress = ethers.verifyMessage(ethers.getBytes(dataHash), signature);
      
      // Verify the address matches
      if (recoveredAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
        throw new Error('Signature verification failed');
      }

      return true;
    } catch (error) {
      console.error('❌ Signature verification failed:', error);
      return false;
    }
  }

  /**
   * Validate request timestamp
   */
  validateTimestamp(timestamp) {
    const now = Math.floor(Date.now() / 1000);
    const age = now - timestamp;
    
    if (age > BLOCKCHAIN_CONFIG.MAX_REQUEST_AGE) {
      throw new Error('Request too old');
    }
    
    if (age < 0) {
      throw new Error('Invalid timestamp');
    }
    
    return true;
  }

  /**
   * Check rate limiting
   */
  checkRateLimit(userAddress, ip) {
    const now = Date.now();
    const key = userAddress || ip;
    
    if (!this.rateLimitStore.has(key)) {
      this.rateLimitStore.set(key, []);
    }
    
    const requests = this.rateLimitStore.get(key);
    
    // Remove old requests
    const recentRequests = requests.filter(
      timestamp => now - timestamp < BLOCKCHAIN_CONFIG.RATE_LIMIT_WINDOW
    );
    
    if (recentRequests.length >= BLOCKCHAIN_CONFIG.MAX_REQUESTS_PER_WINDOW) {
      throw new Error('Rate limit exceeded');
    }
    
    // Add current request
    recentRequests.push(now);
    this.rateLimitStore.set(key, recentRequests);
    
    return true;
  }

  /**
   * Validate security token
   */
  async validateSecurityToken(req) {
    try {
      const securityToken = req.headers['x-security-token'];
      const userAddress = req.headers['x-user-address'];
      const timestamp = parseInt(req.headers['x-timestamp']);
      const nonce = req.headers['x-nonce'];
      
      if (!securityToken || !userAddress || !timestamp || !nonce) {
        throw new Error('Missing security headers');
      }
      
      // Parse security token
      const tokenData = JSON.parse(securityToken);
      
      // Validate timestamp
      this.validateTimestamp(timestamp);
      
      // Verify signature if available
      if (tokenData.signature) {
        const isValid = await this.verifySignature(
          tokenData,
          tokenData.signature.signature,
          userAddress
        );
        
        if (!isValid) {
          throw new Error('Invalid signature');
        }
      }
      
      // Check rate limiting
      this.checkRateLimit(userAddress, req.ip);
      
      return {
        userAddress,
        timestamp,
        nonce,
        isValid: true
      };
    } catch (error) {
      console.error('❌ Security token validation failed:', error);
      throw error;
    }
  }

  /**
   * Create secure response
   */
  async createSecureResponse(data, userAddress) {
    try {
      const response = {
        success: true,
        data: data,
        timestamp: Math.floor(Date.now() / 1000)
      };
      
      // Add blockchain signature if provider is available
      if (this.provider && userAddress) {
        try {
          const dataHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(data)));
          // In a real implementation, you would sign this with a server key
          response.signature = {
            hash: dataHash,
            address: userAddress,
            timestamp: response.timestamp
          };
        } catch (error) {
          console.warn('⚠️ Response signing failed:', error);
        }
      }
      
      return response;
    } catch (error) {
      console.error('❌ Secure response creation failed:', error);
      return { success: true, data: data };
    }
  }

  /**
   * Log security event
   */
  logSecurityEvent(event, details) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event,
      details: details,
      level: 'SECURITY'
    };
    
    console.log('🔒 Security Event:', JSON.stringify(logEntry, null, 2));
  }

  /**
   * Clean up rate limit store
   */
  cleanupRateLimitStore() {
    const now = Date.now();
    for (const [key, requests] of this.rateLimitStore.entries()) {
      const recentRequests = requests.filter(
        timestamp => now - timestamp < BLOCKCHAIN_CONFIG.RATE_LIMIT_WINDOW
      );
      
      if (recentRequests.length === 0) {
        this.rateLimitStore.delete(key);
      } else {
        this.rateLimitStore.set(key, recentRequests);
      }
    }
  }
}

// Create singleton instance
const backendBlockchainSecurity = new BackendBlockchainSecurity();

// Clean up rate limit store every 5 minutes
setInterval(() => {
  backendBlockchainSecurity.cleanupRateLimitStore();
}, 5 * 60 * 1000);

module.exports = backendBlockchainSecurity;
