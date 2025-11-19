'use strict'

const {Schema, model} = require('mongoose');
const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "keys";

const keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Shop'
    },
    privateKey: {
        type: String,
        require: true
    },
    publicKey: {
        type: String,
        require: true
    },
    refreshTokensUsed: {
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, keyTokenSchema);