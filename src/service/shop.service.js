'use strict'

const shopModel = require('../models/shop.model');

const findByEmail = async ({email, select = {
    password: 1,
    roles: 1,
    email: 1,
    name: 1
}}) => {
    return await shopModel.findOne({email}).select(select).lean();
}

module.exports = {
    findByEmail
}