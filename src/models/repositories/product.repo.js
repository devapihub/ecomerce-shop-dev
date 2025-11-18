'use strict'

import {product} from "../product.model.js";
import mongoose from 'mongoose';
import {getSelectData, unGetSelectData} from "../../utils/index.js";

const {Types} = mongoose;

export const publishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });

    if (!foundShop) {
        return null;
    }

    foundShop.isDraft = false;
    foundShop.isPublished = true;

    const res = await product.updateOne(
        {_id: foundShop._id},
        {$set: foundShop}
    );
    return res.modifiedCount;
}

export const unPublishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });

    if (!foundShop) {
        return null;
    }

    foundShop.isDraft = true;
    foundShop.isPublished = false;

    const res = await product.updateOne(
        {_id: foundShop._id},
        {$set: foundShop}
    );
    return res.modifiedCount;
}

export const queryProducts = async ({query, limit, skip}) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({updatedAt: -1})
        .skip(skip)
        .limit(limit)
        .exec();
}

export const searchProductByUser = async ({keySearch}) => {
    const regexSearch = new RegExp(keySearch);
    return await product.find({
        isPublished: true,
        $text: {$search: regexSearch}
    }, {score: {$meta: "textScore"}})
        .sort({score: {$meta: "textScore"}})
        .lean();
}

export const findAllProducts = async ({limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
    return await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData({select}))
        .lean()
        .exec();
}

export const findProduct = async ({product_id, unSelect}) => {
    return await product.findById(product_id)
        .select(unGetSelectData({unSelect}))
        .lean()
        .exec();
}
