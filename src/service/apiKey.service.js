'use strict'

const apiKeyModel = require('../models/apiKey.model');
const crypto = require('crypto');
const findById = async (key) => {
   /* const newKey = apiKeyModel.create({
        key: crypto.randomBytes(16).toString('hex'),
        permissions: ['0000']
    });*/
    return apiKeyModel.findOne({key, status: true}).lean();
}

module.exports = {findById}