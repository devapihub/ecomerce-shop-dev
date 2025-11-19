'use strict'

import mongoose from "mongoose";

const {Schema, model} = mongoose;
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "inventories";

const inventorySchema = new Schema({
    inven_productId: {type: Schema.Types.ObjectId, ref: 'Product', require: true},
    inven_location: {type: String, default: 'unknown'},
    inven_stock: {type: Number, require: true},
    inven_shopId: {type: Schema.Types.ObjectId, ref: 'Shop', require: true},
    inven_reservation: {type: Array, default: []}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

export const inventory = model(DOCUMENT_NAME, inventorySchema);
