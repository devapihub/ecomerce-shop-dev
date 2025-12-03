'use strict'

import mongoose from 'mongoose';
const { model, Schema } = mongoose;
const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "shops";

const ShopSchema = new Schema({
    name: { type: String, required: true, maxLength: 150, trim: true },
    slug: { type: String, maxLength: 150, unique: true, lowercase: true },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ratings: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0, min: 0 }
    },
    productCount: { type: Number, default: 0, min: 0 },
    avatar: { type: String, default: '' }, 
    banner: { type: String, default: '' },
    description: { type: String, maxLength: 1000, default: '' },
    address: {
        street: { type: String, required: true, trim: true },
        
        wardCode: { type: String, required: true },
        wardName: { type: String, required: true },
        
        districtCode: { type: String, required: true },
        districtName: { type: String, required: true },
        
        provinceCode: { type: String, required: true },
        provinceName: { type: String, required: true }
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

ShopSchema.index({ owner: 1 });
ShopSchema.index({ slug: 1 }, { unique: true });

ShopSchema.pre('save', function(next) {
    if (this.isModified('name') && !this.slug) {
        const slugify = (str) => {
            return str
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[đĐ]/g, 'd')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        };
        
        this.slug = slugify(this.name) + '-' + this._id.toString().slice(-6);
    }
    next();
});

export const shop = model(DOCUMENT_NAME, ShopSchema);

