const express = require('express');
const router = express.Router();
const order = require('./../database_tables/order');
const { authenticateJWT } = require('./../authentication/jwt_authentication');
const { hashPassword, comparePasswords } = require('./../authentication/password_hashing');

router.post('/add-order', authenticateJWT, async(req, res) => {
    try {
        const newOrder = new order({ 
            transaction_id: '',
            buyer_id: req.user, 
            item_id: req.body.itemId, 
            seller_id: req.body.sellerEmail, 
            item_name: req.body.itemName,
            amount: req.body.amount, 
            hashed_otp: '',
        });
        const orders = await order.find();
        for(let i = 0; i < orders.length; i++) {
            if(orders[i].buyer_id === newOrder.buyer_id && orders[i].item_id === newOrder.item_id) {
                return res.status(400).json({ message: 'Order already exists' });
            }
        }
        await newOrder.save();
        return res.status(200).json({ message: 'Order added successfully' });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/pending-deliveries', authenticateJWT, async(req, res) => {
    try {
        const orders = await order.find({ seller_id: req.user, transaction_id: '' });
        return res.status(200).json({pendingDeliveries: orders});
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/verify-otp', authenticateJWT, async(req, res) => {
    try {
        const id = req.body.orderId;
        const otp = req.body.otp;
        const orderDetails = await order.findById(id);
        if(orderDetails.transaction_id !== '') {
            return res.status(400).json({ message: 'Order already verified' });
        }
        const result = await comparePasswords(otp, orderDetails.hashed_otp);
        if(result) {
            orderDetails.transaction_id = 'verified';
            await orderDetails.save();
            return res.status(200).json({ message: 'OTP verified successfully' });
        }
        return res.status(400).json({ message: 'Invalid OTP' });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/fetch-history', authenticateJWT, async(req, res) => {
    try {
        const orders = await order.find();
        let pendingOrders = [], boughtOrders = [], soldOrders = [];
        for(let i = 0; i < orders.length; i++) {
            if(orders[i].buyer_id === req.user && orders[i].transaction_id === 'verified') {
                boughtOrders.push(orders[i]);
            }
            else if(orders[i].seller_id === req.user && orders[i].transaction_id === 'verified') {
                soldOrders.push(orders[i]);
            }
            else if(orders[i].buyer_id === req.user && orders[i].transaction_id === '') {
                pendingOrders.push(orders[i]);
            }
        }
        return res.status(200).json({ pending: pendingOrders, bought: boughtOrders, sold: soldOrders });
    }
    catch(err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/change-hashed-otp', authenticateJWT, async(req, res) => {
    try {
        const id = req.body.orderId;
        const otp = req.body.otp;
        const orderDetails = await order.findById(id);
        if(orderDetails.transaction_id !== '') {
            return res.status(400).json({ message: 'Order already verified' });
        }
        const hashedOTP = await hashPassword(otp);
        orderDetails.hashed_otp = hashedOTP;
        await orderDetails.save();
        return res.status(200).json({ message: 'OTP changed successfully' });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;