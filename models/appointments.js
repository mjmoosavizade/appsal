const mongoose = require('mongoose');

const type = ['general', 'special'];

const AppointmentSchema = mongoose.Schema({
    date: { type: Date, required: true },
    time: { type: Number, required: true },
    length: { type: String, required: true },
    type: { type: String, required: true, enum: type },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    status: { type: String, required: true, default: "pending" },
    response: { type: mongoose.Schema.Types.ObjectId, ref: 'resultFile' },
    dateCreated: { type: Date, default: Date.now }
});

exports.Appointment = mongoose.model('Appointment', AppointmentSchema);