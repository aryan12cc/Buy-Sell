const express = require('express');
const router = express.Router();
const item = require('./../database_tables/item');
const { authenticateJWT } = require('./../authentication/jwt_authentication');

router.post('/sell-item', authenticateJWT, async(req, res) => {
    try {
        const { name, price, description, category} = req.body;
        const newItem = new item({
            name,
            price,
            description,
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

router.post('/get-items', authenticateJWT, async(req, res) => {
    try {
        const items = await item.find();
        const filteredItems = items.filter(item => {
            return (req.body.sellerFilter === '' || req.body.sellerFilter === item.seller) &&
               (req.body.selectedCategories.length === 0 || req.body.selectedCategories.includes(item.category)) &&
               (req.body.searchTerm === '' || item.name.toLowerCase().includes(req.body.searchTerm.toLowerCase())) &&
               (req.body.priceRange.min === '' || item.price >= req.body.priceRange.min) &&
               (req.body.priceRange.max === '' || item.price <= req.body.priceRange.max);
        });
        return res.status(200).json({ items: filteredItems });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/get-item-by-id', authenticateJWT, async(req, res) => {
    try {
        const itemData = await item.find({ _id: req.body.itemId });
        if(itemData.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        return res.status(200).json({ item: itemData[0] });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/delete-item/:itemId', authenticateJWT, async(req, res) => {
    try {
        const { itemId } = req.params;
        await item.findByIdAndDelete(itemId);
        return res.status(200).json({ message: 'Item deleted successfully' });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;