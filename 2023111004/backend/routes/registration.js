const express = require('express');
const axios = require('axios');
const router = express.Router();
const user = require('../database_tables/user');
const { generateToken } = require('../authentication/jwt_authentication');
const { hashPassword, comparePasswords } = require('../authentication/password_hashing');

const RECAPTCHA_SECRET_KEY = '6LfV68sqAAAAAIKIy5TV6PvFdJBOBBPqP7jV0OFF';

// Function to verify reCAPTCHA
const verifyRecaptcha = async (token) => {
    try {
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: RECAPTCHA_SECRET_KEY,
                response: token
            }
        });
        return response.data.success;
    } 
    catch (error) {
        console.error('reCAPTCHA verification failed:', error);
        return false;
    }
};

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, age, contact, password, confirmPassword, recaptchaToken } = req.body;

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
        return res.status(400).json({ status: 'bad', message: 'reCAPTCHA verification failed' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ status: 'bad', message: 'Passwords do not match' });
    }

    const emailDomain = email.split('@')[1];
    if (!['research.iiit.ac.in', 'iiit.ac.in', 'students.iiit.ac.in'].includes(emailDomain)) {
        return res.status(400).json({ status: 'bad', message: 'Email domain not allowed' });
    }

    try {
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'bad', message: 'User with this email already exists' });
        }

        const passwordHash = await hashPassword(password);
        const newUser = new user({
            firstName,
            lastName,
            email,
            age,
            contact,
            passwordHash,
            jwtToken: '',
            cartItems: []
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'User validation failed' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password, recaptchaToken } = req.body;

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
        return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    try {
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await comparePasswords(password, existingUser.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken({ email });
        existingUser.jwtToken = token;
        await existingUser.save();
        res.status(200).json({ message: 'Login successful', user: existingUser, token: token });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Invalid email or password' });
    }
});

module.exports = router;
