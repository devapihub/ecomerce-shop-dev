import apiKeyModel from '../models/apiKey.model.js';
import crypto from 'node:crypto';
const findById = async (key) => {
    return apiKeyModel.findOne({key, status: true}).lean();
}

const createApiKey = async () => {
    return apiKeyModel.create({
        key: crypto.randomBytes(16).toString('hex'),
        permissions: ['0000']
    });
}

export {findById, createApiKey};