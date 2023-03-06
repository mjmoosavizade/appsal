const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    message: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, require: false },
    filePath: { type: String, require: false },
    status:{type:String, default:'sent'},
    date: { type: Date, default: Date.now, },
    forwarded:{type: Boolean, default:false},
});


exports.Message = mongoose.model('Messages', messageSchema);