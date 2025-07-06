const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  product: String,
  city: String,
  message: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', enquirySchema);
