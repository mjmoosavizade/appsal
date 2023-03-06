const mongoose = require('mongoose');

const SupportMessagesSchema = mongoose.Schema({
    type: { type: Number, required: true },
    message: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
});


exports.SupportMessages = mongoose.model('SupportMessages', SupportMessagesSchema);

