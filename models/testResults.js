const mongoose = require('mongoose');

const TestResultSchema = mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resultFile: { type: String, require: true },
    testType: { type: String, require: true },
    created_at: { type: Date, default: Date.now },
});

exports.TestResult = mongoose.model('resultFile', TestResultSchema);