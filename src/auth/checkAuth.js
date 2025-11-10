'use strict'

const {findById} = require("../service/apiKey.service");
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({message: 'Forbidden'});
        }
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({message: 'Forbidden'});
        }
        req.objKey = objKey;
        return next();
    } catch (error) {
        console.error('Error in API key middleware:', error);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        try {
            if (!req.objKey.permissions.includes(permission)) {
                return res.status(403).json({message: 'Forbidden'});
            }
            return next();
        } catch (error) {
            console.error('Error in permission middleware:', error);
            return res.status(500).json({message: 'Internal Server Error'});
        }
    }
}

module.exports = {apiKey}