# Email Setup Guide

## Quick Fix: EmailJS Setup

To make the contact form actually send emails, you need to set up EmailJS (free service):

### Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Create a new service (Gmail, Outlook, etc.)

### Step 2: Get Your Keys
1. Go to EmailJS dashboard
2. Copy your **Public Key** (User ID)
3. Copy your **Service ID**
4. Create an email template and copy the **Template ID**

### Step 3: Update the Code
In `src/ContactUsModal.js`, replace these lines:
```javascript
emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your EmailJS public key
const result = await emailjs.send(
  'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
  'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
  templateParams
);
```

### Step 4: Email Template
Create a template in EmailJS with these variables:
- `{{from_name}}` - Customer name
- `{{from_email}}` - Customer email
- `{{phone}}` - Customer phone
- `{{product}}` - Product interested in
- `{{city}}` - Customer city
- `{{message}}` - Customer message

## Alternative: Simple Backend Solution

If you prefer a backend solution, I can help you set up a simple Node.js server with Nodemailer.

## Current Status
- ✅ Frontend form validation working
- ✅ Success message showing
- ⚠️ Email sending needs EmailJS setup
- ✅ Fallback: Form still works even if email fails

## Test the Form
1. Fill out the contact form
2. Click "Send Enquiry"
3. You should see success message
4. Check your email (once EmailJS is configured)
