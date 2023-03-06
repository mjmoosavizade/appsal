const { TestResult } = require('../models/testResults');

exports.createTestResult = (req, res) => {
    console.log(req.file)
    const testResult = new TestResult({
        customer: req.body.customer,
        uploader: req.body.uploader,
        testType: req.body.testType,
        resultFile: req.file.path,
    });
    testResult
        .save()
        .then(result => {
            res.status(200).json({ success: true, data: result })
        })
        // .catch(err => {
        //     res.status(500).json({ success: false, error: err })
        // })
};

exports.getAllResults = (req, res) => {
    TestResult
        .find()
        .select('-__v')
        .populate('customer', 'firstname lastname _id')
        .populate('uploader', 'firstname lastname _id')
        .then(result => {
            if (result.length === 0) {
                res.status(404).json({ status: false, message: "No content" });
            } else {
                res.status(200).json({ status: true, data: result });
            }
        })
};

exports.getOneResults = (req, res) => {
    TestResult
        .find({ customer: req.userData.userId })
        .select('-__v')
        .populate('customer', 'firstname lastname _id')
        .populate('uploader', 'firstname lastname _id')
        .then(result => {
            if (result.length === 0) {
                res.status(404).json({ status: false, message: "No content" });
            } else {
                res.status(200).json({ status: true, data: result });
            }
        })
};

exports.deleteResult = (req, res) => {
    TestResult
        .deleteOne({ _id: req.params.id })
        .exec()
        .then(result => {
            if (result) {
                res.status(202).json({ success: true, message: 'Result deleted successfuly ' })
            } else {
                res.status(404).json({ success: false, message: 'Result id incorect' })
            }
        })
        .catch(err => {
            res.status(500).json({ success: false, message: 'Error deleting Result', error: err })
        });
};

exports.updateResult = (req, res) => {
    const updateOps = {
        customer: req.body.customer,
        uploader: req.body.uploader,
        resultFile: req.file.path
    };
    TestResult.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }, { new: true })
        .exec()
        .then((doc) => {
            res.status(200).json({ success: true, data: doc });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "error updating the result", error: err });
        });
};