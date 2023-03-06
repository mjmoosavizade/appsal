const { QuizQuestion } = require('../models/quizQuestions');

exports.createQuiestion = (req, res) => {
    QuizQuestion.find({ quiz: req.body.quiz })
        .exec()
        .then(result => {
            console.log(result)
            if (result.length >= 1) {
                let exists = false;
                result.forEach(value => {
                    if (value.level == req.body.level) {
                        exists = true;
                    }
                });
                if (exists) {
                    res.status(409).json({ success: false, message: "Quesion already exists in this level" })
                } else {
                    const createObj = {};
                    for (const [objKey, value] of Object.entries(req.body)) {
                        createObj[objKey] = value;
                    }
                    const quizQuesion = new QuizQuestion(createObj);
                    quizQuesion.save().then(result => {
                        return res.status(201).json({ success: true, data: result })
                    }).catch(err => {
                        return res.status(500).json({ success: 'false', message: "Error createing a Question", error: err })
                    });
                }
            } else {
                const createObj = {};
                for (const [objKey, value] of Object.entries(req.body)) {
                    createObj[objKey] = value;
                }
                const quizQuesion = new QuizQuestion(createObj);
                quizQuesion.save().then(result => {
                    return res.status(201).json({ success: true, data: result })
                }).catch(err => {
                    return res.status(500).json({ success: 'false', message: "Error createing a Question", error: err })
                });
            }
        })
        .catch(err => {
            return res.status(500).json({ success: 'false', message: "Error createing a Question", error: err })
        })
};

exports.getAllQuestions = (req, res) => {
    QuizQuestion.find()
        .exec()
        .then(result => {
            if (result.length >= 1) {
                res.status(200).json({ success: true, data: result });
            } else {
                res.status(404).json({ success: false, message: "No content" });
            }
        })
        .catch(err => {
            res.status(404).json({ success: false, message: "Error getting the questiuons" });
        });
};

exports.getOneQuestion = (req, res) => {
    QuizQuestion.find({ _id: req.params.id })
        .exec()
        .then(result => {
            if (result.length >= 1) {
                res.status(200).json({ success: true, data: result[0] });
            } else {
                res.status(404).json({ success: false, message: "No content" });
            }
        })
        .catch(err => {
            res.status(404).json({ success: false, message: "Error getting the questiuon" });
        });
};

exports.deleteQuestion = (req, res) => {
    QuizQuestion.findByIdAndRemove(req.params.id).exec()
        .then(result => {
            if (result) {
                return res.status(200).json({ success: true, message: "The Question is deleted" })
            } else {
                return res.status(404).json({ success: false, message: "Question not found" });;
            }
        }).catch(err => {
            return res.status(500).json({ success: false, message: err })
        })
};

exports.updateQuestion = (req, res) => {
    QuizQuestion.find({ quiz: req.body.quiz })
        .exec()
        .then(result => {
            console.log(result)
            if (result.length >= 1) {
                let exists = false;
                result.forEach(value => {
                    if (value.level == req.body.level) {
                        exists = true;
                    }
                });
                if (exists) {
                    res.status(409).json({ success: false, message: "Quesion already exists in this level" })
                } else {
                    const updateOps = {};
                    for (const [objKey, value] of Object.entries(req.body)) {
                        updateOps[objKey] = value;
                    }
                    QuizQuestion.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }, { new: true })
                        .exec()
                        .then(result => {
                            return res.status(201).json({ success: true, data: result })
                        })
                        .catch(err => {
                            return res.status(500).json({
                                success: 'false',
                                message: "Error updating the Question",
                                error: err
                            })
                        });
                }
            } else {
                const updateOps = {};
                for (const [objKey, value] of Object.entries(req.body)) {
                    updateOps[objKey] = value;
                }
                QuizQuestion.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }, { new: true })
                    .exec()
                    .then(result => {
                        return res.status(201).json({ success: true, data: result })
                    })
                    .catch(err => {
                        return res.status(500).json({
                            success: 'false',
                            message: "Error updating the Question",
                            error: err
                        })
                    });
            }
        })
        .catch(err => {
            return res.status(500).json({ success: 'false', message: "Error updating the Question", error: err })
        })

};