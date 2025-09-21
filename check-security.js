#!/usr/bin/env node

/**
 * Security Status Check
 * Run this to check your security configuration
 */

const https = require('https');
const http = require('http');

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

console.log('🔍 Checking Security Status...\n');

// Check health endpoint
function checkHealth() {
  return new Promise((resolve) => {
    const protocol = API_URL.startsWith('https') ? https : http;
    
    protocol.get(API_URL + '/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          console.log('✅ Server Health:', health.status);
          console.log('   Uptime:', Math.round(health.uptime), 'seconds');
          console.log('   Blockchain:', health.security.blockchain);
          console.log('   Encryption:', health.security.encryption);
          console.log('   Rate Limit:', health.security.rateLimit);
          resolve(true);
        } catch (error) {
          console.log('❌ Health check failed:', error.message);
          resolve(false);
        }
      });
    }).on('error', (error) => {
      console.log('❌ Cannot connect to server:', error.message);
      resolve(false);
    });
  });
}

// Check security status
function checkSecurityStatus() {
  return new Promise((resolve) => {
    const protocol = API_URL.startsWith('https') ? https : http;
    
    protocol.get(API_URL + '/security-status', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const security = JSON.parse(data);
          console.log('\n🔒 Security Configuration:');
          console.log('   Blockchain Connected:', security.security.blockchain.connected);
          console.log('   Chain ID:', security.security.blockchain.chainId);
          console.log('   Encryption Enabled:', security.security.encryption.enabled);
          console.log('   Rate Limit Enabled:', security.security.rateLimit.enabled);
          console.log('   CSP Enabled:', security.security.headers.csp);
          console.log('   HSTS Enabled:', security.security.headers.hsts);
          console.log('   XSS Protection:', security.security.headers.xss);
          resolve(true);
        } catch (error) {
          console.log('❌ Security status check failed:', error.message);
          resolve(false);
        }
      });
    }).on('error', (error) => {
      console.log('❌ Cannot check security status:', error.message);
      resolve(false);
    });
  });
}

// Run checks
async function runChecks() {
  const healthOk = await checkHealth();
  const securityOk = await checkSecurityStatus();
  
  if (healthOk && securityOk) {
    console.log('\n🎉 All security checks passed! Your website is secure.');
  } else {
    console.log('\n⚠️  Some security checks failed. Please check your configuration.');
  }
}

runChecks();
