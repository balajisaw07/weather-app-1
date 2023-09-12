const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

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

    return res.status(201).json({ message: 'User registered successfully' });
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

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        return res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                defaultCountry: user.defaultCountry,
            },
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/dashboard', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').lean();
        return res.json({
            message: 'This is a protected route',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                settings: user.settings,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
router.put('/update-profile', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { selectedCity } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.settings) {
            user.settings = {};
        }
        if (selectedCity) {
            user.settings.defaultLocation = selectedCity.name;
            user.settings.defaultCountry = selectedCity.country;
        } else {
            user.settings.defaultLocation = null;
            user.settings.defaultCountry = null;
        }

        await user.save();

        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
