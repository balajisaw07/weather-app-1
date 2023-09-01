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
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        /* eslint-disable no-underscore-dangle */
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        return res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
        /* eslint-enable no-underscore-dangle */
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/dashboard', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        res.json({
            message: 'This is a protected route',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
