const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, },
    richDescription: { type: String, default: '' },
    image: { type: String, default: '' },
    images: [{ type: String }],
    brand: { type: String },
    price: { type: Number, min: [0, 'Price can\'t go bellow zero!'], default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', },
    countInStock: { type: Number, min: [0, 'Quantity can\'t go bellow zero!'] },
    rating: { type: Number, min: [0, 'Quantity can\'t go bellow zero!'] },
    numReviews: { type: Number, default: 0, min: [0, 'Number of reviews can\'t go bellow zero!'] },
    isFeatured: { type: Boolean, default: false },
    dataCreated: { type: Date, default: Date.now }
});


exports.Product = mongoose.model('Product', productSchema);