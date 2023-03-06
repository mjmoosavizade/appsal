const mongoose = require('mongoose');

const authorType = ['customer', 'responder']

const TicketSchema = mongoose.Schema({
    status: { type: Boolean, default: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    responder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date_created: { type: Date, default: Date.now }
});

const TicketConvoSchema = mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    message: { type: String, },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorType: { type: String, enum: authorType, required: true },
    date_created: { type: Date, default: Date.now }
});

exports.Ticket = mongoose.model('Ticket', TicketSchema);
exports.TicketConvo = mongoose.model('TicketConvo', TicketConvoSchema);