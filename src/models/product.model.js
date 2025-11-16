// src/models/product.model.js
'use strict'

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
        type: String,
        required: true,
        enum: ['Clothing', 'Electronics', 'Books', 'Furniture', 'Toys', 'Other']
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    product_attributes: { type: Schema.Types.Mixed, required: true },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop', required: true},
}, {
    collection: 'Clothes',
    timestamps: true
});

const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: { type: String },
    color: { type: String },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop', required: true},
}, {
    collection: 'Electronics',
    timestamps: true
});

const furnitureSchema = new Schema({
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop', required: true},
}, {
    collection: 'Furnitures',
    timestamps: true
});

export const product = model(DOCUMENT_NAME, productSchema);
export const electronic = model('Electronic', electronicSchema);
export const clothing = model('Clothing', clothingSchema);
export const furniture = model('Furniture', furnitureSchema);
