const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true
        },
        qty: Number,
        status: {
            type: Boolean, default: false
        }
    }],
    date: { type: Date, default: Date.now },
});


exports.Order = mongoose.model('Order', orderSchema);