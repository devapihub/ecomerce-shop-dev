'use strict'

const {model, Schema} = require('mongoose');
const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "shops";

const ShopSchema = new Schema({
    name: {type: String, required: true, maxLength: 150},
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {type: String, enum: ['active', 'inactive'], default: 'inactive'},
    verify: {type: Schema.Types.Boolean, default: false},
    role: {
        type: [String],
        default: []
    },
    avatar: {type: String, default: ''}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
ShopSchema.index({owner: 1});
module.exports = model(DOCUMENT_NAME, ShopSchema);