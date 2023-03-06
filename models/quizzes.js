const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
    quizCategory: { type: String, required: true, },
    quizTitle: { type: String, required: true },
    quizIcon: { type: String, required: true },
    quizAudio: { type: String, required: true },
    quizDimension: { type: String, required: true },
    quizDescription: { type: String, },
    active: { type: Boolean, default: false },
});


exports.Quiz = mongoose.model('Quiz', quizSchema);