const jwt = require("jsonwebtoken");
const { User } = require("../models/users");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ");
        const decoded = jwt.decode(token[1], process.env.JWT_KEY, null);
        const id = decoded.userId;
        console.log(id)
        User.findById(id)
            .select("userType")
            .exec()
            .then((doc) => {
                console.log(doc)
                if (doc) {
                    if (doc.userType === 'manager' || doc.userType === 'specialist') {
                        next();
                    } else {
                        return res.status(401).json({ success: false, message: "Not authorized" });
                    }
                } else {
                    res
                        .status(404)
                        .json({ success: false, message: "No valid entry found for provided ID" });
                }
            })
            .catch((err) => {
                res
                    .status(500)
                    .json({ success: false, message: "error while looking for user", error: err });
            });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Authorization failed" });
    }
};