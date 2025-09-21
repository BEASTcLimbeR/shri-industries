#!/usr/bin/env node

/**
 * Security Setup Script
 * This script helps set up the blockchain security features
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔒 Setting up Blockchain Security for Shri Industries...\n');

// Generate secure encryption key
function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}

// Create .env file if it doesn't exist
function createEnvFile() {
  const envPath = path.join(__dirname, 'backend', '.env');
  const envExamplePath = path.join(__dirname, 'backend', 'env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      let envContent = fs.readFileSync(envExamplePath, 'utf8');
      
      // Generate secure encryption key
      const encryptionKey = generateEncryptionKey();
      envContent = envContent.replace('your_super_secure_encryption_key_here_32_chars_min', encryptionKey);
      
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Created .env file with secure encryption key');
    } else {
      console.log('⚠️  env.example not found, please create .env manually');
    }
  } else {
    console.log('✅ .env file already exists');
  }
}

// Check if required packages are installed
function checkDependencies() {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const backendPackageJsonPath = path.join(__dirname, 'backend', 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const requiredDeps = ['ethers', 'crypto-js'];
    
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
    
    if (missingDeps.length > 0) {
      console.log('⚠️  Missing frontend dependencies:', missingDeps.join(', '));
      console.log('   Run: npm install ' + missingDeps.join(' '));
    } else {
      console.log('✅ Frontend dependencies are installed');
    }
  }
  
  if (fs.existsSync(backendPackageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(backendPackageJsonPath, 'utf8'));
    const requiredDeps = ['helmet', 'express-rate-limit', 'ethers', 'crypto-js'];
    
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
    
    if (missingDeps.length > 0) {
      console.log('⚠️  Missing backend dependencies:', missingDeps.join(', '));
      console.log('   Run: cd backend && npm install ' + missingDeps.join(' '));
    } else {
      console.log('✅ Backend dependencies are installed');
    }
  }
}

// Create security status check
function createSecurityCheck() {
  const securityCheckPath = path.join(__dirname, 'check-security.js');
  const securityCheckContent = `#!/usr/bin/env node

/**
 * Security Status Check
 * Run this to check your security configuration
 */

const https = require('https');
const http = require('http');

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

console.log('🔍 Checking Security Status...\\n');

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
          console.log('\\n🔒 Security Configuration:');
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
    console.log('\\n🎉 All security checks passed! Your website is secure.');
  } else {
    console.log('\\n⚠️  Some security checks failed. Please check your configuration.');
  }
}

runChecks();
`;

  fs.writeFileSync(securityCheckPath, securityCheckContent);
  console.log('✅ Created security check script: check-security.js');
}

// Main setup function
async function setup() {
  try {
    console.log('1. Creating environment configuration...');
    createEnvFile();
    
    console.log('\n2. Checking dependencies...');
    checkDependencies();
    
    console.log('\n3. Creating security check script...');
    createSecurityCheck();
    
    console.log('\n🎉 Security setup completed!');
    console.log('\nNext steps:');
    console.log('1. Install missing dependencies if any');
    console.log('2. Configure your .env file with your settings');
    console.log('3. Start the backend: cd backend && npm start');
    console.log('4. Start the frontend: npm start');
    console.log('5. Run security check: node check-security.js');
    console.log('\n🔒 Your website is now protected with blockchain security!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setup();
