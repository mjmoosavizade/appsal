const mongoose = require('mongoose');

const quizResult = mongoose.Schema({
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: { type: [Number], required: true },
    score: { type: Number, required: true },
    specilistNote: { Type: String },
    specilistPDF: { type: String },
    specilistvideo: { type: String },
    specilistAudio: { type: String },
    created_at: { type: Date, default: Date.now, }
});


exports.QuizResult = mongoose.model('QuizResult', quizResult);