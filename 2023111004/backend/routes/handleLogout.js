const express = require('express');
const router = express.Router();
const user = require('./../database_tables/user');

router.post('/', async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ status: 'bad', message: 'User with this email does not exist' });
        }
        await user.updateOne({ email }, { jwtToken: '' });
        res.status(200).json({ message: 'User logged out successfully' });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
