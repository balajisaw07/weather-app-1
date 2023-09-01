const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  settings: {
    temperatureUnit: {
      type: String,
      default: 'Celsius'
    },
    defaultLocation: {
      type: String,
      default: ''
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
