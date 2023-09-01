const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    password: hashedPassword,
    email,
  });

  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const payload = {
    id: user._id,
    username: user.username,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

  res.status(200).json({ message: 'Logged in successfully', token });
});

router.get('/dashboard', auth, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
