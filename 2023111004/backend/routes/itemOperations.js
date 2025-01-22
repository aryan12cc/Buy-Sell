const express = require('express');
const router = express.Router();
const item = require('./../database_tables/item');
const { authenticateJWT } = require('./../authentication/jwt_authentication');

router.post('/sell-item', authenticateJWT, async(req, res) => {
    try {
        const { name, price, description, category} = req.body;
        const newItem = new item({
            name,
            description,
            price,
            category,
            seller: req.user,
        });
        await newItem.save();
        return res.status(200).json({ message: 'Item added successfully' });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;