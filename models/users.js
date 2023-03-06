const mongoose = require('mongoose');
// const ttl = require('mongoose-ttl');

const userRole = ['admin', 'user', 'specialist', ]
const gender = ['MALE', 'FEMALE', 'OTHER', ]


const UserSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, required: false, },
    image: { type: String, required: false, },
    passwordHash: { type: String, required: true },
    jobTitle: { type: String, },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: /^(\+98|0098|98|0)?9\d{9}$/,
    },
    userType: { type: String, enum: userRole, default: 'user' },
    gender: { type: String, enum: gender },
    address: { type: String, },
    landPhone: { type: String },
    birthdate: { type: Date },
    healthBackground: { type: String },
    active: { type: Boolean, default: false },
    connection:{type: String, default:'offline'},
    dateCreated: { type: Date, default: Date.now },
});

const ActivationCodeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateCreated: { type: Date, default: Date.now, expires: '10s' },
    authCode: { type: Number, }
});
// ActivationCodeSchema.plugin(ttl, { ttl: 60000 * 2, interval: 5000 });

const ForgotPassSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authCode: { type: Number, },
});


exports.User = mongoose.model('User', UserSchema);
exports.ActivationCode = mongoose.model('ActivationCode', ActivationCodeSchema);
exports.ForgotPass = mongoose.model('ForgotPass', ForgotPassSchema);