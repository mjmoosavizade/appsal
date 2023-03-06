const { Product } = require('../models/products');
const { CartProduct } = require('../models/cart');

exports.getAllProducts = (req, res) => {
    
};

exports.createProduct = (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.file.path,
        description: req.file.description,
        richDescription: req.file.richDescription,
        countInStock: req.body.countInStock,
        category: req.body.category,
        brand: req.body.brand,
        price: req.body.price,
        isFeatured: req.body.isFeatured,
    });
    product.save().then(createdProduct => {
        res.status(201).json(createdProduct)
    }).catch(err => {
        res.status(500).json({
            error: err,
            success: false
        })
    });
};

exports.getAProduct = (req, res) => {
    Product.find({ _id: req.params.id }).then(productList => {
        console.log(productList)
        if (productList.length < 1) {
            res.status(404).json({ success: false, message: 'No Content' });
        } else {
            res.status(200).json({ success: true, data: productList[0] });
        }
    }).catch(err => {
        res.status(500).json({ success: false, message: err })
    });
}

exports.searchProducts = (req, res) => {
    console.log(req.query)
    Product.find(req.query).lean().then(productList => {
        console.log(productList)
        if (productList.length < 1) {
            res.status(404).json({ success: false, message: 'No Content' });
        } else {
            res.status(200).json({ success: true, data: productList });
        }
    })
        .catch(err => {
            res.status(500).json({ success: false, message: err })
        });
};

exports.newCart = (req, res) => {
    const cart = new CartProduct({
        user: req.userData.userId,
        product: req.body.product,
        qty: req.body.qty,
    });
    cart.save().then(createdProduct => {
        res.status(201).json(createdProduct)
    }).catch(err => {
        res.status(500).json({
            error: err,
            success: false
        })
    });
}

exports.deleteCartItem = (req, res) => {
    CartProduct.deleteOne({ _id: req.params.id }).exec().then(result => {
        res.status(200).json({ success: true, message: 'item removed' });
    }).catch(err => {
        res.status(500).json({ success: false, message: 'Failed to item user', error: err });
    })
}

exports.editCartItem = (req, res) => {
    const updateOps = {};
    for (const [objKey, value] of Object.entries(req.body)) {
        updateOps[objKey] = value;
    }
    CartProduct.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }, { new: true })
        .exec()
        .then((doc) => {
            res.status(200).json({ success: true, data: doc });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "error updating the cart", error: err });
        });
}

exports.getMyCart = (req, res) => {
    CartProduct.find({ user: req.userData.userId })
        .populate('product')
        .exec()
        .then(result => {
            res.status(200).json({ success: true, data: result });
        })
        .catch(err => {
            res.status(500).json({ success: false, message: "error getting the cart", error: err })
        })
}