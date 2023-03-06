const { Quiz } = require('../models/quizzes');
const { QuizQuestion } = require('../models/quizQuestions');
const ObjectId = require('mongoose').Types.ObjectId;

exports.createQuiz = (req, res) => {
    const quiz = new Quiz({
        quizCategory: req.body.quizCategory,
        quizTitle: req.body.quizTitle,
        quizIcon: req.files.quizIcon[0].path,
        quizAudio: req.files.quizAudio[0].path,
        quizDimension: req.body.quizDimension,
        quizDescript: req.body.quizDescript,
        active: req.body.active,
    })
    quiz.save().then(result => {
        return res.status(201).json({ success: true, data: result })
    }).catch(err => {
        return res.status(500).json({ success: 'false', message: "Error createing a Question", error: err })
    });
};

exports.getAllCategories = (req, res) => {
    let data = []
    Quiz.find()
        .exec()
        .then(results => {
            if (results.length >= 1) {
                results.forEach((element, index) => {
                    QuizQuestion.find({ quiz: ObjectId(element._id) })
                        .exec()
                        .then(questionResults => {
                            if (questionResults.length >= 1) {
                                data.push({
                                    "active": results[index].active,
                                    "_id": results[index]._id,
                                    "quizCategory": results[index].quizCategory,
                                    "quizDescription": results[index].quizDescription,
                                    "questions": questionResults,
                                });

                                res.status(200).json({ success: true, data: data });
                            } else {
                                data.push({
                                    "active": results[index].active,
                                    "_id": results[index]._id,
                                    "quizCategory": results[index].quizCategory,
                                    "quizDescription": results[index].quizDescription,
                                    "questions": [],
                                });

                                res.status(200).json({ success: true, data: data });
                            }
                        })
                        .catch(err => {
                            return res.status(500).json({ success: 'false', message: "Error getting the Quiz", error: err })
                        })
                });
            } else {
                res.status(404).json({ success: false, message: "No content" });
            }
        })
    // .catch(err => {
    //     res.status(404).json({ success: false, error: err });
    // })
};

exports.getOneCategories = (req, res) => {
    let data = []
    Quiz.find({ _id: req.params.id })
        .exec()
        .then(results => {
            if (results.length >= 1) {
                QuizQuestion.find({ quiz: ObjectId(results[0]._id) })
                    .exec()
                    .then(questionResults => {
                        if (questionResults.length >= 1) {
                            data.push({
                                "active": results[0].active,
                                "_id": results[0]._id,
                                "quizCategory": results[0].quizCategory,
                                "quizDescription": results[0].quizDescription,
                                "quizTitle": results[0].quizTitle,
                                "quizAudio": results[0].quizAudio,
                                "questions": questionResults,
                            });

                            res.status(200).json({ success: true, data: data });
                        } else {
                            data.push({
                                "active": results[0].active,
                                "_id": results[0]._id,
                                "quizCategory": results[0].quizCategory,
                                "quizDescription": results[0].quizDescription,
                                "quizTitle": results[0].quizTitle,
                                "quizAudio": results[0].quizAudio,
                                "questions": [],
                            });

                            res.status(200).json({ success: true, data: data });
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({ success: 'false', message: "Error getting the Quiz", error: err })
                    })
            } else {
                res.status(404).json({ success: false, message: "No content" });
            }
        })
        .catch(err => {
            res.status(404).json({ success: false, error: err });
        })
};

exports.updateQuiz = (req, res) => {
    const updateOps = {};
    for (const [objKey, value] of Object.entries(req.body)) {
        updateOps[objKey] = value;
    }
    if (req.files.quizAudio) {
        updateOps["quizAudio"] = req.files.quizAudio[0].path
    }
    if (req.files.quizIcon) {
        updateOps["quizIcon"] = req.files.quizIcon[0].path
    }
    Quiz.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps }, { new: true })
        .exec()
        .then((doc) => {
            res.status(200).json({ success: true, data: doc });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "error updating the Quiz", error: err });
        });
};

exports.getQuizzesInDiemnsion = (req, res) => {
    Quiz.find({ quizDimension: req.params.quizDimension })
        .exec()
        .then((result) => {
            res.status(200).json({ success: true, data: result });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: err, message: "failed getting the Quiz" });
        })
}