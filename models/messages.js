const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    message: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    type: { type: String, require: false },
    filePath: { type: String, require: false },
    status:{type:String, default:'sent'},
    date: { type: Date, default: Date.now, },
    forwarded:{type: Boolean, default:false},
});

const chatSchema = mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    date: { type: Date, default: Date.now, },
});

chatSchema.virtual('messages', {
    ref: 'Messages',
    localField: '_id',
    foreignField: 'chat'
  });

exports.Message = mongoose.model('Messages', messageSchema);
exports.Chat = mongoose.model ('Chat', chatSchema);