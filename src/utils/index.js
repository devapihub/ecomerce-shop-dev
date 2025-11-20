'use strict'

import _ from 'lodash';
import mongoose from 'mongoose';

const {Types} = mongoose;

export const convertToObjectIdMongodb = (id) => {
    return new Types.ObjectId(id);
}

export const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields);
}

export const getSelectData = ({select = []}) => {
    return Object.fromEntries(select.map((field) => [field, 1]));
}

export const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(key => {
        if (!obj[key]) {
            delete obj[key];
        }
    });

    return obj;
}

export const updateNestedObject = obj => {
    const final = {};
    if (obj == null) {
        return final;
    }
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObject(obj[key]);
            Object.keys(response).forEach(nestedKey => {
                final[`${key}.${nestedKey}`] = response[nestedKey];
            });
        } else {
            final[key] = obj[key];
        }
    });
    return final;
}

export const unGetSelectData = ({select = []}) => {
    return Object.fromEntries(select.map((field) => [field, 0]));
}