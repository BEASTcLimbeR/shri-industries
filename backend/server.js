require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');
const Enquiry = require('./models/Enquiry');

const app = express();
app.use(cors());
app.use(express.json());

console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

app.post('/send-enquiry', async (req, res) => {
  const { productName, name, email, message } = req.body;

  // Configure transporter (replace with your real credentials)
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Shriindustryich@gmail.com', // your email
      pass: 'nzuemkbytjehfach' // your app password
    }
  });

  let mailOptions = {
    from: 'Shriindustryich@gmail.com',
    to: 'Shriindustryich@gmail.com',
    replyTo: email,
    subject: `Enquiry for ${productName}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  // Thank you email to the user
  let thankYouMailOptions = {
    from: 'Shriindustryich@gmail.com',
    to: email,
    subject: 'Thank You for Your Enquiry – Shri Industries',
    text: `Dear ${name},\n\nThank you for reaching out to Shri Industries!\n\nWe've received your enquiry and truly appreciate your interest in our products. We will get in touch with you shortly with the details you requested.\n\nIf you have any additional questions or need urgent assistance, feel free to contact us at +91 9322663649 or reply to this email.\n\nWe look forward to helping you find the perfect solution for your needs.\n\nWarm regards,\nShri Industries\n📞+91 9322663649 | ✉️ shri_industry@yahoo.com | 📍17/141 Gurukripa, Vivekanand Colony Ichalkaranji Pin code: 416115`
  };

  try {
    // Send to admin
    let adminResult = await transporter.sendMail(mailOptions);
    console.log('Admin email sent:', adminResult.response);

    // Send thank you to user
    let userResult = await transporter.sendMail(thankYouMailOptions);
    console.log('Thank you email sent:', userResult.response);

    // Save to MongoDB
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    console.log('Enquiry saved to MongoDB:', enquiry);

    res.status(200).json({ message: 'Enquiry sent and saved successfully!' });
  } catch (err) {
    console.error('Error saving enquiry:', err);
    res.status(500).json({ error: 'Failed to save enquiry' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 