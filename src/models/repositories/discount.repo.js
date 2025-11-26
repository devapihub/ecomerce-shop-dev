'use strict'

import {discount} from "../discount.model.js";
import mongoose from 'mongoose';
import {getSelectData, unGetSelectData} from "../../utils/index.js";

const {Types} = mongoose;

export const findAllDiscountCodesUnselected = async (
    {
        filter,
        limit = 50,
        page = 1,
        sort = 'ctime',
        unselect
    }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
    return await discount.find(filter)
        .sort(sortBy)
        .limit(limit)
        .skip(skip)
        .select(unGetSelectData(unselect))
        .lean()
        .exec();
}

export const findAllDiscountCodesSelected = async (
    {
        filter,
        limit = 50,
        page = 1,
        sort = 'ctime',
        select
    }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
    return await discount.find(filter)
        .sort(sortBy)
        .limit(limit)
        .skip(skip)
        .select(getSelectData(select))
        .lean()
        .exec();
}

export const checkDiscountExists = async ({filter}) => {
    return await discount.findOne(filter).lean().exec();
}