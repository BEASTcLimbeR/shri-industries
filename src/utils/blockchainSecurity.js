/**
 * Blockchain Security Utilities
 * This file provides comprehensive blockchain-based security features
 * for the Shri Industries website
 */

import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

// Configuration for blockchain security
const BLOCKCHAIN_CONFIG = {
  // Using Polygon Mumbai testnet for cost-effective transactions
  CHAIN_ID: 80001, // Polygon Mumbai
  RPC_URL: 'https://polygon-mumbai.g.alchemy.com/v2/demo',
  // Smart contract address (we'll deploy this)
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  // IPFS gateway for decentralized storage
  IPFS_GATEWAY: 'https://ipfs.io/ipfs/',
  // Encryption key (in production, this should be generated per user)
  ENCRYPTION_KEY: process.env.REACT_APP_ENCRYPTION_KEY || 'shri-industries-secure-key-2024'
};

class BlockchainSecurity {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isConnected = false;
    this.userAddress = null;
  }

  /**
   * Initialize blockchain connection
   * This method sets up the connection to the blockchain network
   */
  async initialize() {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Get signer
        this.signer = await this.provider.getSigner();
        this.userAddress = await this.signer.getAddress();
        this.isConnected = true;
        
        console.log('🔗 Blockchain connected:', this.userAddress);
        return true;
      } else {
        console.warn('⚠️ MetaMask not detected. Some security features will be limited.');
        return false;
      }
    } catch (error) {
      console.error('❌ Blockchain initialization failed:', error);
      return false;
    }
  }

  /**
   * Generate a cryptographic signature for data integrity
   * This creates a unique signature that proves data hasn't been tampered with
   */
  async generateSignature(data) {
    try {
      if (!this.signer) {
        throw new Error('Blockchain not connected');
      }

      // Create a hash of the data
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(data)));
      
      // Sign the hash with the user's private key
      const signature = await this.signer.signMessage(ethers.getBytes(dataHash));
      
      return {
        hash: dataHash,
        signature: signature,
        address: this.userAddress,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('❌ Signature generation failed:', error);
      throw error;
    }
  }

  /**
   * Encrypt sensitive data using AES encryption
   * This ensures that even if data is intercepted, it cannot be read
   */
  encryptData(data) {
    try {
      const jsonString = JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(jsonString, BLOCKCHAIN_CONFIG.ENCRYPTION_KEY).toString();
      return encrypted;
    } catch (error) {
      console.error('❌ Encryption failed:', error);
      throw error;
    }
  }

  /**
   * Decrypt sensitive data
   */
  decryptData(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, BLOCKCHAIN_CONFIG.ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('❌ Decryption failed:', error);
      throw error;
    }
  }

  /**
   * Create a secure hash for data integrity verification
   * This creates a unique fingerprint of the data
   */
  createDataHash(data) {
    const jsonString = JSON.stringify(data);
    return CryptoJS.SHA256(jsonString).toString();
  }

  /**
   * Verify data integrity using blockchain signature
   * This ensures the data hasn't been tampered with
   */
  async verifyDataIntegrity(data, signature, expectedAddress) {
    try {
      if (!this.provider) {
        throw new Error('Blockchain not connected');
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
      console.error('❌ Data integrity verification failed:', error);
      return false;
    }
  }

  /**
   * Generate a secure nonce for preventing replay attacks
   * This ensures each request is unique and cannot be reused
   */
  generateNonce() {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  /**
   * Create a secure timestamp for request validation
   * This prevents old requests from being replayed
   */
  createSecureTimestamp() {
    return Math.floor(Date.now() / 1000); // Unix timestamp
  }

  /**
   * Validate request timestamp (prevent replay attacks)
   * This ensures requests are not too old
   */
  validateTimestamp(timestamp, maxAge = 300) { // 5 minutes default
    const now = Math.floor(Date.now() / 1000);
    return (now - timestamp) <= maxAge;
  }

  /**
   * Create a comprehensive security token for API requests
   * This combines multiple security measures
   */
  async createSecurityToken(data) {
    try {
      const nonce = this.generateNonce();
      const timestamp = this.createSecureTimestamp();
      const dataHash = this.createDataHash(data);
      
      const securityData = {
        data: data,
        nonce: nonce,
        timestamp: timestamp,
        dataHash: dataHash,
        userAddress: this.userAddress
      };

      // Generate signature for the security data
      const signature = await this.generateSignature(securityData);
      
      return {
        ...securityData,
        signature: signature
      };
    } catch (error) {
      console.error('❌ Security token creation failed:', error);
      throw error;
    }
  }

  /**
   * Get current user's blockchain address
   */
  getCurrentAddress() {
    return this.userAddress;
  }

  /**
   * Check if blockchain is connected
   */
  isBlockchainConnected() {
    return this.isConnected;
  }

  /**
   * Disconnect from blockchain
   */
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isConnected = false;
    this.userAddress = null;
  }
}

// Create a singleton instance
const blockchainSecurity = new BlockchainSecurity();

export default blockchainSecurity;
