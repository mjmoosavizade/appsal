const mongoose = require('mongoose');

const cartProductSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    qty: { type: Number, default: 0 }
});


exports.CartProduct = mongoose.model('CartProduct', cartProductSchema);

