'use strict'

const apiKeyModel = require('../models/apiKey.model');
const crypto = require('node:crypto');
const findById = async (key) => {
    return apiKeyModel.findOne({key, status: true}).lean();
}

const createApiKey = async () => {
    return apiKeyModel.create({
        key: crypto.randomBytes(16).toString('hex'),
        permissions: ['0000']
    });
}

module.exports = {findById, createApiKey}