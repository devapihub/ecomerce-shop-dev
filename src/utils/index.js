'use strict'

import _ from 'lodash';
export const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields);
}

export const getSelectData = ({select = []}) => {
    return Object.fromEntries(select.map((field) => [field, 1]));
}

export const unGetSelectData = ({select = []}) => {
    return Object.fromEntries(select.map((field) => [field, 0]));
}