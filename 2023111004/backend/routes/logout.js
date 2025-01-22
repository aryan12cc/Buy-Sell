const express = require('express');
const router = express.Router();
const user = require('../database_tables/user');

router.post('/', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const { updatedJwtToken } = '';
    try {
        const existingUser = await user.findOneAndUpdate({jwtToken: token}, {$set: updatedJwtToken}, {new: true, runValidators: true});
        if (!existingUser) {
            return res.status(400).json({ status: 'bad', message: 'User with this token does not exist' });
        }
        res.status(200).json({ message: 'User logged out successfully' });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
