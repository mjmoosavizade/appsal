const { User } = require('../models/users');

module.exports = (req, res, next) => {
    User.find({ _id: req.userData._id }).then(userList => {
        if (userList.length < 1) {
            res.status(404).json({ success: false, message: 'No Content' });
        } else {
            if (userList[0].active == true) {
                next();
            } else {
                res.status(403).json({ success: false, message: 'User is not activated' });
            }
        }
    }).catch(err => {
        res.status(500).json({ success: false, message: err })
    });
};