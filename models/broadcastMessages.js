const mongoose = require('mongoose');

const bradcastType = ['all', 'user']

const BraodcastMessageSchema = mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    bradcastType: { type: String, enum: bradcastType, required: true },
    reciever: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    read_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    created_at: { type: Date, default: Date.now }
});


exports.BraodcastMessage = mongoose.model('BraodcastMessage', BraodcastMessageSchema);

