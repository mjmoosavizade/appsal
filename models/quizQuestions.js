const mongoose = require('mongoose');

const quizQuestionSchema = mongoose.Schema({
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    questionTitle: { type: String, required: true },
    questionDescription: { type: String },
    questionWeight: { type: Number, default: 1 },
    level: { type: Number, required: true, min: 1, max: 10 },
});


exports.QuizQuestion = mongoose.model('QuizQustion', quizQuestionSchema);