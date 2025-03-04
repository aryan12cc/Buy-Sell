const express = require('express');
const router = express.Router();
const item = require('./../database_tables/item');
const user = require('./../database_tables/user');
const { authenticateJWT } = require('./../authentication/jwt_authentication');

router.post('/add-to-cart', authenticateJWT, async(req, res) => {
    try {
        const { itemId } = req.body;
        const itemData = await item.findById(itemId);
        if(!itemData) {
            return res.status(404).json({ message: 'Item not found' });
        }
        const userData = await user.findOne({email: req.user});
        for(let i = 0; i < userData.cartItems.length; i++) {
            if(userData.cartItems[i] === itemId) {
                return res.status(400).json({ message: 'Item already in cart' });
            }
        }
        userData.cartItems.push(itemId);
        await userData.save();
        return res.status(200).json({ message: 'Item added to cart successfully' });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/view-cart', authenticateJWT, async(req, res) => {
    try {
        const userData = await user.findOne({email: req.user});
        const cartItems = [];
        for(const itemId of userData.cartItems) {
            const itemData = await item.findById(itemId);
            if(!itemData) continue; // item was sold
            cartItems.push(itemData);
        }
        userData.cartItems = cartItems;
        await userData.save();
        return res.status(200).json({ items: cartItems });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/remove-item/:itemId', authenticateJWT, async(req, res) => {
    try {
        const { itemId } = req.params;
        const userData = await user.findOne({email: req.user});
        const newCartItems = userData.cartItems.filter((item) => item._id != itemId);
        userData.cartItems = newCartItems;
        await userData.save();
        return res.status(200).json({ message: 'Item removed from cart' });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;