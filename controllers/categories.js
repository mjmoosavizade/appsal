const { Category } = require('../models/categories');


exports.getOneCategory = (req, res) => {
    const id = req.params.id;
    Category.findById(id)
        .exec()
        .then((doc) => {
            console.log()
            if (doc) {
                res.status(200).json({ success: true, data: doc });
            } else {
                res
                    .status(404)
                    .json({ success: false, message: "No valid entry found for provided ID" });
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: "error fetching the field",
                error: err
            });
        });
};

exports.getAllCategories = (req, res) => {
    Category.find().then(categoryList => {
        if (!categoryList) {
            res.status(204).json({ success: false, message: 'No Content' });
        } else {
            res.status(200).json({ success: true, data: categoryList });
        }
    }).catch(err => {
        res.status(500).json({ success: false, message: err })
    });

};

exports.createCategory = (req, res) => {
    const createObj = {};
    for (const [objKey, value] of Object.entries(req.body)) {
        createObj[objKey] = value;
    }
    const category = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
        image: req.body.image,
    });
    category.save().then(createdCategory => {
        res.status(201).json(createdCategory)
    }).catch(err => {
        res.status(500).json({
            error: err,
            success: false
        })
    });
};

exports.deleteCategory = (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then(category => {
            if (category) {
                return res.status(200).json({ success: true, message: "The category is deleted" })
            } else {
                return res.status(404).json({ success: false, message: "Category not found" });;
            }
        }).catch(err => {
            return res.status(500).json({ success: false, message: err })
        })
};

exports.updateCategory = (req, res) => {
    const updateOps = {};
    for (const [objKey, value] of Object.entries(req.body)) {
        updateOps[objKey] = value;
    }
    Category.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }, { new: true })
        .exec()
        .then((doc) => {
            res.status(200).json({ success: true, data: doc });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "error updating the field", error: err });
        });
};