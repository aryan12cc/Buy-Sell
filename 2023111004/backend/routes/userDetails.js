const express = require('express');
const user = require('./../database_tables/user');
const { authenticateJWT } = require('./../authentication/jwt_authentication');
const { hashPassword } = require('./../authentication/password_hashing');
const router = express.Router();

router.get('/', authenticateJWT, async (req, res) => {
    const email = req.user;
    if(!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const databaseUser = await user.findOne({ email });
        if(!databaseUser) {
        return res.status(404).json({ message: 'User not found' });
        }
        const userData = databaseUser.toObject(); 
        delete userData.passwordHash;
        res.json({ user: userData });
    } 
    catch(error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/update-user', authenticateJWT, async (req, res) => {
    const email = req.body.email;
    const updatedFields = {};
    updatedFields.firstName = req.body.firstName;
    updatedFields.lastName = req.body.lastName;
    updatedFields.age = req.body.age;
    updatedFields.contact = req.body.contact;
    updatedFields.passwordHash = req.body.password;
    if(updatedFields.passwordHash === '') {
        delete updatedFields.passwordHash;
    }
    else {
        updatedFields.passwordHash = await hashPassword(req.body.password);
    }
    console.log('req.body: ', req.body);
    try {
        const updatedUser = await user.findOneAndUpdate({email}, {$set: updatedFields}, {new: true, runValidators: true});
        if(!updatedUser) {
            return res.status(404).json({message: 'User not found'});
        }
        const userObj = updatedUser.toObject();
        delete userObj.passwordHash;
        return res.status(200).json({user: userObj});
    }
    catch(error) {
        const actualUser = await user.findOne({email});
        const userObj = actualUser.toObject();
        delete userObj.passwordHash;
        return res.status(400).json({user: userObj});
    }
});

module.exports = router;