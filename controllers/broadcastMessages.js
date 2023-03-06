const { BraodcastMessage } = require('../models/broadcastMessages');


exports.getOneMessage = (req, res) => {
    const id = req.userData.userId;
    BraodcastMessage.findById(id)
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

exports.getUnread = (req, res) => {
    const id = req.userData.userId;
    BraodcastMessage.find({
        "read_by": { "$nin": [id] },
        $or: [{ bradcastType: 'all' }, { reciever: id }]
    })
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

exports.getRead = (req, res) => {
    const id = req.userData.userId;
    BraodcastMessage.find({
        "read_by": { "$in": [id] },
        $or: [{ bradcastType: 'all' }, { reciever: id }]
    })
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

exports.getMyMessages = (req, res) => {
    const id = req.params.id;
    BraodcastMessage.find({
        $or: [{ bradcastType: 'all' }, { reciever: id }]
    })
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

exports.getAllMessages = (req, res) => {
    BraodcastMessage.find().then(messageList => {
        if (!messageList) {
            res.status(204).json({ success: false, message: 'No Content' });
        } else {
            res.status(200).json({ success: true, data: messageList });
        }
    }).catch(err => {
        res.status(500).json({ success: false, message: err })
    });

};

exports.createMessage = (req, res) => {
    const createObj = {};
    for (const [objKey, value] of Object.entries(req.body)) {
        createObj[objKey] = value;
    }
    const message = new BraodcastMessage({
        title: req.body.title,
        message: req.body.message,
        bradcastType: req.body.bradcastType,
        reciever: req.body.reciever,
    });
    message.save().then(cratedMessage => {
        res.status(201).json(cratedMessage)
    }).catch(err => {
        res.status(500).json({
            error: err,
            success: false
        })
    });
};

exports.deleteMessage = (req, res) => {
    BraodcastMessage.findByIdAndRemove(req.params.id)
        .then(message => {
            if (message) {
                return res.status(200).json({ success: true, message: "The message is deleted" })
            } else {
                return res.status(404).json({ success: false, message: "message not found" });;
            }
        }).catch(err => {
            return res.status(500).json({ success: false, message: err })
        })
};

exports.updateMessage = (req, res) => {
    const updateOps = {};
    for (const [objKey, value] of Object.entries(req.body)) {
        updateOps[objKey] = value;
    }
    console.log(updateOps)
    BraodcastMessage.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }, { new: true })
        .exec()
        .then((doc) => {
            res.status(200).json({ success: true, data: doc });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "error updating the message", error: err });
        });
};

exports.readMessage = (req, res) => {
    console.log(req.userData.userId)
    BraodcastMessage.findOneAndUpdate({ _id: req.params.id }, { $push: { read_by: req.userData.userId } }, { new: true })
        .exec()
        .then((doc) => {
            res.status(200).json({ success: true, data: doc });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "error updating the message", error: err });
        });
}