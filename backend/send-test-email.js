require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('📧 Sending test email...');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email content
const testEmail = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER, // Send to yourself for testing
  subject: '🧪 Test Email from Shri Industries Website',
  text: `This is a test email from the Shri Industries website contact form system.

If you receive this email, the automatic email system is working correctly!

Test Details:
- Time: ${new Date().toISOString()}
- From: ${process.env.EMAIL_USER}
- System: Shri Industries Contact Form

This means customers will now receive automatic confirmation emails when they submit enquiries through your website.`
};

transporter.sendMail(testEmail, (error, info) => {
  if (error) {
    console.log('❌ Error sending test email:', error.message);
  } else {
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Check your inbox at:', process.env.EMAIL_USER);
  }
});
