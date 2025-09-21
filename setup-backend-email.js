#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up backend email configuration...');

// Create .env file for backend
const envContent = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/shri_industries

# Email Configuration (for contact form)
EMAIL_USER=shri.industryich@gmail.com
EMAIL_PASS=your_app_password_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Simple email service (using Gmail)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Security Configuration
LOG_LEVEL=info
SECURITY_MODE=development

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

const envPath = path.join(__dirname, 'backend', '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Backend .env file created successfully!');
  console.log('📧 Email configured for: shri.industryich@gmail.com');
  console.log('');
  console.log('⚠️  IMPORTANT: You need to set up Gmail App Password:');
  console.log('1. Go to Google Account settings');
  console.log('2. Enable 2-Factor Authentication');
  console.log('3. Generate an App Password for Gmail');
  console.log('4. Replace "your_app_password_here" in backend/.env with the app password');
  console.log('');
  console.log('🚀 To start the backend server:');
  console.log('   cd backend && npm start');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
}
