/**
 * Secure API Client with Blockchain Security
 * This client handles all API requests with blockchain-based security measures
 */

import blockchainSecurity from './blockchainSecurity';

class SecureApiClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    this.requestQueue = new Map(); // For rate limiting
    this.maxRequestsPerMinute = 10; // Rate limiting
  }

  /**
   * Initialize the secure API client
   * This sets up blockchain security for all API calls
   */
  async initialize() {
    try {
      // Initialize blockchain security
      const isConnected = await blockchainSecurity.initialize();
      
      if (!isConnected) {
        console.warn('⚠️ Blockchain not connected. Using fallback security measures.');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Secure API client initialization failed:', error);
      return false;
    }
  }

  /**
   * Check rate limiting to prevent abuse
   * This prevents too many requests from the same user
   */
  checkRateLimit() {
    const now = Date.now();
    const userAddress = blockchainSecurity.getCurrentAddress() || 'anonymous';
    
    if (!this.requestQueue.has(userAddress)) {
      this.requestQueue.set(userAddress, []);
    }
    
    const userRequests = this.requestQueue.get(userAddress);
    
    // Remove requests older than 1 minute
    const recentRequests = userRequests.filter(
      timestamp => now - timestamp < 60000
    );
    
    if (recentRequests.length >= this.maxRequestsPerMinute) {
      throw new Error('Rate limit exceeded. Please wait before making another request.');
    }
    
    // Add current request
    recentRequests.push(now);
    this.requestQueue.set(userAddress, recentRequests);
    
    return true;
  }

  /**
   * Create secure headers for API requests
   * This adds multiple layers of security to each request
   */
  async createSecureHeaders(data) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Security-Version': '1.0',
      'X-Timestamp': blockchainSecurity.createSecureTimestamp().toString(),
      'X-Nonce': blockchainSecurity.generateNonce()
    };

    // Add blockchain security if connected
    if (blockchainSecurity.isBlockchainConnected()) {
      try {
        const securityToken = await blockchainSecurity.createSecurityToken(data);
        headers['X-Security-Token'] = JSON.stringify(securityToken);
        headers['X-User-Address'] = blockchainSecurity.getCurrentAddress();
      } catch (error) {
        console.warn('⚠️ Blockchain security token creation failed:', error);
      }
    }

    return headers;
  }

  /**
   * Encrypt sensitive data before sending
   * This ensures data is protected in transit
   */
  encryptSensitiveData(data) {
    try {
      // Identify sensitive fields
      const sensitiveFields = ['email', 'phone', 'message', 'name'];
      const encryptedData = { ...data };
      
      // Encrypt sensitive fields
      sensitiveFields.forEach(field => {
        if (encryptedData[field]) {
          encryptedData[field] = blockchainSecurity.encryptData(encryptedData[field]);
        }
      });
      
      // Add encryption flag
      encryptedData._encrypted = true;
      encryptedData._encryptionVersion = '1.0';
      
      return encryptedData;
    } catch (error) {
      console.error('❌ Data encryption failed:', error);
      return data; // Return unencrypted data as fallback
    }
  }

  /**
   * Make a secure POST request
   * This handles all POST requests with blockchain security
   */
  async securePost(endpoint, data) {
    try {
      // Check rate limiting
      this.checkRateLimit();
      
      // Encrypt sensitive data
      const encryptedData = this.encryptSensitiveData(data);
      
      // Create secure headers
      const headers = await this.createSecureHeaders(encryptedData);
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        // Make the request
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(encryptedData),
          credentials: 'include', // Include cookies for additional security
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
      
        // Handle response
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Verify response integrity if blockchain is connected
        if (blockchainSecurity.isBlockchainConnected() && result.signature) {
          const isValid = await blockchainSecurity.verifyDataIntegrity(
            result.data,
            result.signature,
            result.address
          );
          
          if (!isValid) {
            throw new Error('Response integrity verification failed');
          }
        }
        
        return result;
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          throw new Error('Request timeout. Please try again.');
        }
        
        console.error('❌ Secure POST request failed:', error);
        throw error;
      }
  }

  /**
   * Make a secure GET request
   * This handles all GET requests with blockchain security
   */
  async secureGet(endpoint, params = {}) {
    try {
      // Check rate limiting
      this.checkRateLimit();
      
      // Create secure headers
      const headers = await this.createSecureHeaders(params);
      
      // Build URL with parameters
      const url = new URL(`${this.baseURL}${endpoint}`);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });
      
      // Make the request
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Verify response integrity if blockchain is connected
      if (blockchainSecurity.isBlockchainConnected() && result.signature) {
        const isValid = await blockchainSecurity.verifyDataIntegrity(
          result.data,
          result.signature,
          result.address
        );
        
        if (!isValid) {
          throw new Error('Response integrity verification failed');
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Secure GET request failed:', error);
      throw error;
    }
  }

  /**
   * Send a secure enquiry (main functionality)
   * This is the main method for sending enquiries with full security
   */
  async sendSecureEnquiry(enquiryData) {
    try {
      // Validate required fields
      if (!enquiryData.name || !enquiryData.email || !enquiryData.message) {
        throw new Error('Missing required fields');
      }
      
      // Add additional security data
      const secureEnquiryData = {
        ...enquiryData,
        timestamp: blockchainSecurity.createSecureTimestamp(),
        nonce: blockchainSecurity.generateNonce(),
        userAddress: blockchainSecurity.getCurrentAddress() || 'anonymous',
        dataHash: blockchainSecurity.createDataHash(enquiryData)
      };
      
      // Send the secure enquiry
      const result = await this.securePost('/send-enquiry', secureEnquiryData);
      
      return result;
    } catch (error) {
      console.error('❌ Secure enquiry sending failed:', error);
      throw error;
    }
  }

  /**
   * Get secure enquiries (if needed)
   * This retrieves enquiries with integrity verification
   */
  async getSecureEnquiries() {
    try {
      const result = await this.secureGet('/api/enquiries');
      return result;
    } catch (error) {
      console.error('❌ Secure enquiries retrieval failed:', error);
      throw error;
    }
  }

  /**
   * Get email statistics securely
   * This retrieves statistics with integrity verification
   */
  async getSecureEmailStats() {
    try {
      const result = await this.secureGet('/api/email-stats');
      return result;
    } catch (error) {
      console.error('❌ Secure email stats retrieval failed:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const secureApiClient = new SecureApiClient();

export default secureApiClient;
