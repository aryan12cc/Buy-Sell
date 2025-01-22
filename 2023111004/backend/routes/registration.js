const express = require('express');
const router = express.Router();
const user = require('../database_tables/user');
const { generateToken } = require('../authentication/jwt_authentication');
const { hashPassword, comparePasswords } = require('../authentication/password_hashing');

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, age, contact, password, confirmPassword } = req.body;
    if(password !== confirmPassword) {
        return res.status(400).json({ status: 'bad', message: 'Passwords do not match' });
    }
    const emailDomain = email.split('@')[1];
    if(emailDomain !== 'research.iiit.ac.in' && emailDomain !== 'iiit.ac.in' && emailDomain !== 'students.iiit.ac.in') {
        return res.status(400).json({ status: 'bad', message: 'Email domain not allowed' });
    }
    try {
        const existingUser = await user.findOne({ email });
        if(existingUser) {
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
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch(err) {
        console.error(err);
        if(err.name == 'ValidationError') {
            return res.status(400).json({ message: 'User validation failed' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await user.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await comparePasswords(password, existingUser.passwordHash);
        if(!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = generateToken({ email });
        existingUser.jwtToken = token;
        await existingUser.save();
        res.status(200).json({ message: 'Login successful', user: existingUser, token: token });
    } 
    catch(err) {
        console.error(err);
        res.status(400).json({ message: 'Invalid email or password' });
    }
});

module.exports = router;
