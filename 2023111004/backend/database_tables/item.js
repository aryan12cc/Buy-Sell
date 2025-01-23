const mongoose = require('mongoose');
const User = require('./user');

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            validate: {
                validator: function(value) {
                    return /^[a-zA-Z0-9 ]+$/.test(value);
                },
                message: 'Name can only contain letters, numbers, and spaces.'
            }
        },
        price: {
            type: Number,
            required: true,
            validate: {
                validator: function(value) {
                    return value > 0;
                },
                message: 'Price must be greater than 0.'
            }
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            validate: {
                validator: function(value) {
                    return ['Electronics', 'Books', 'Clothing', 'Food', 'General'].includes(value);
                },
                message: 'Category must be Electronics, Books, Clothing, Food or General.'
            }
        },
        seller: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;