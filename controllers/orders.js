const { Order } = require('../models/orders');


exports.getOneOrder = (req, res) => {
    const id = req.userData.userId;
    Order.findById(id)
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
                message: "error fetching the message",
                error: err
            });
        });
};

exports.getUndelivered = (req, res) => {
    Order.find({ status: false })
        .exec()
        .then((doc) => {
            console.log()
            if (doc) {
                res.status(200).json({ success: true, data: doc });
            } else {
                res
                    .status(404)
                    .json({ success: false, message: "No valid entry found" });
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: "error fetching the order",
                error: err
            });
        });
};

exports.getDelivered = (req, res) => {
    Order.find({ status: true })
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
                message: "error fetching the message",
                error: err
            });
        });
};

exports.getMyOrders = (req, res) => {
    const id = req.params.id;
    Order.find({ _id: req.userData.userId })
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
                message: "error fetching the orders",
                error: err
            });
        });
};

exports.getAllOrders = (req, res) => {
    Order.find().populate('user items.item').then(messageList => {
        if (!messageList) {
            res.status(204).json({ success: false, message: 'No Content' });
        } else {
            res.status(200).json({ success: true, data: messageList });
        }
    }).catch(err => {
        res.status(500).json({ success: false, message: err })
    });

};

exports.createOrder = (req, res) => {
    console.log(req.body)
    const createObj = {};
    for (const [objKey, value] of Object.entries(req.body)) {
        createObj[objKey] = value;
    }
    console.log(req.body)
    const order = new Order({
        user: req.body.user,
        items: req.body.items,
    });
    order.save().then(cratedMessage => {
        res.status(201).json(cratedMessage)
    }).catch(err => {
        console.log(req.body)
        res.status(500).json({
            error: err,
            success: false
        })
    });
};

// exports.deleteMessage = (req, res) => {
//     BraodcastMessage.findByIdAndRemove(req.params.id)
//         .then(message => {
//             if (message) {
//                 return res.status(200).json({ success: true, message: "The message is deleted" })
//             } else {
//                 return res.status(404).json({ success: false, message: "message not found" });;
//             }
//         }).catch(err => {
//             return res.status(500).json({ success: false, message: err })
//         })
// };

// exports.updateMessage = (req, res) => {
//     const updateOps = {};
//     for (const [objKey, value] of Object.entries(req.body)) {
//         updateOps[objKey] = value;
//     }
//     console.log(updateOps)
//     BraodcastMessage.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }, { new: true })
//         .exec()
//         .then((doc) => {
//             res.status(200).json({ success: true, data: doc });
//         })
//         .catch((err) => {
//             res.status(500).json({ success: false, message: "error updating the message", error: err });
//         });
// };

exports.deliveredProduct = (req, res) => {
    console.log(req.userData.userId)
    const query = { "items._id": req.params.id }
    Order.findOneAndUpdate(query, { "items.$.status": true }, { new: true })
        .exec()
        .then((doc) => {
            res.status(200).json({ success: true, data: doc });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "error updating the message", error: err });
        });
}