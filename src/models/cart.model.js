'use strict'

import mongoose from "mongoose";

const {Schema, model} = mongoose;
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "carts";

const cartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: {type: Array, require: true, default: []},
    cart_count_product: {type: Number, default: 0},
    cart_user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true}
}, {
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    },
    collection: COLLECTION_NAME
})

export const cart = model(DOCUMENT_NAME, cartSchema);
