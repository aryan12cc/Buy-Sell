const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
{
    transaction_id: {
        type: String,
    },
    buyer_id: {
        type: String,
        required: true,
    },
    item_id: {
        type: String,
        required: true,
    },
    seller_id: {
        type: String,
        required: true,
    },
    item_name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    hashed_otp: {
        type: String,
    },
},
{
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;