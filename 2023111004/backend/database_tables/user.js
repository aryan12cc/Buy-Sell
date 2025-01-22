const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
    firstName: {
        type: String,
        required: true,
        validate: {
        validator: function (value) {
            return /^[a-zA-Z]+$/.test(value);
        },
        message: 'First name cannot contain numbers or spaces.',
        },
    },
    lastName: {
        type: String,
        required: true,
        validate: {
        validator: function (value) {
            return /^[a-zA-Z]+$/.test(value); 
        },
        message: 'Last name cannot contain numbers or spaces.',
        },
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
        validator: function (value) {
            const allowedDomains = ['students.iiit.ac.in', 'research.iiit.ac.in', 'iiit.ac.in'];
            const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
            if (!emailRegex.test(value)) return false;

            const domain = value.split('@')[1];
            return allowedDomains.includes(domain);
        },
        message: 'Email must belong to students.iiit.ac.in, research.iiit.ac.in, or iiit.ac.in domains.',
        },
    },
    age: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value > 0;
            },
            message: "Age must be greater than 0."
        }
    },
    contact: {
        type: Number,
        required: true,
        validate: {
        validator: function (value) {
            return /^[0-9]{10}$/.test(value.toString());
        },
        message: 'Contact number must be exactly 10 digits.',
        },
    },
    passwordHash: { type: String, required: true },
    jwtToken: { type: String },
    },
    { timestamps: true }
);

const User = mongoose.model('user', userSchema);


module.exports = User;
