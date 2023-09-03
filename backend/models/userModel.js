const mongoose = require('mongoose');

const emailRegex = /^([\w-.]+@([\w-]+.)+[\w-]{2,4})?$/;

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            match: [emailRegex, 'Please enter a valid email'],
        },
        settings: {
            temperatureUnit: {
                type: String,
                default: 'Celsius',
            },
            defaultLocation: {
                type: String,
                default: '',
            },
            defaultCountry: {
                type: String,
                default: 'Finland',
            },
        },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
