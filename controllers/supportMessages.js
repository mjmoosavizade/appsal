const { SupportMessages } = require('../models/supportMessages');


exports.getOneMessage = (req, res) => {
    const id = req.params.id;
    SupportMessages.findById(id)
        .exec()
        .then((doc) => {
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
    SupportMessages.find().populate('sender').then(messageList => {
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
    const message = new SupportMessages({
        type: req.body.type,
        message: req.body.message,
        sender: req.userData.userId,
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
    SupportMessages.findByIdAndRemove(req.params.id)
        .then(message => {
            if (message) {
                return res.status(200).json({ success: true, message: "The message is deleted" })
            } else {
                return res.status(404).json({ success: false, message: "message not found" });;
            }
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: err })
        })
};

exports.updateMessage = (req, res) => {
    const updateOps = {};
    for (const [objKey, value] of Object.entries(req.body)) {
        updateOps[objKey] = value;
    }
    console.log(updateOps)
    SupportMessages.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }, { new: true })
        .exec()
        .then((doc) => {
            res.status(200).json({ success: true, data: doc });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "error updating the message", error: err });
        });
};
