const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  location: { type: String, required: true },
  temperature: { type: Number, required: true },
  condition: { type: String, required: true },
});

module.exports = mongoose.model('Weather', weatherSchema);
