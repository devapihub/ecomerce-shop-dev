'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = "OTP";
const COLLECTION_NAME = "otps";

const OTPSchema = new Schema({
    email: { 
        type: String, 
        required: true, 
        trim: true, 
        lowercase: true,
        index: true
    },
    otpCode: { 
        type: String, 
        required: true 
    },
    otpExpires: { 
        type: Date, 
        required: true 
    },
    type: {
        type: String,
        enum: ['signup', 'reset_password'],
        default: 'signup'
    },
    signupData: {
        full_name: { type: String },
        password: { type: String } // Đã hash
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

OTPSchema.index({otpExpires: 1}, {expireAfterSeconds: 0});

OTPSchema.index({email: 1, type: 1});

module.exports = model(DOCUMENT_NAME, OTPSchema);