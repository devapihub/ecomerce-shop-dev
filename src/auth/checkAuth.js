'use strict'

const {findById} = require("../service/apiKey.service");
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const apiKey = async (req, res, next) => {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
        
        return res.status(403).json({message: 'Forbidden'});
    }
    const objKey = await findById(key);
    if (!objKey) {
        console.log('No API key provided');

        return res.status(403).json({message: 'Forbidden'});
    }
    req.objKey = objKey;
    return next();
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({message: 'Permission denied'});
        }
        console.log(req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({message: 'Permission denied'});
        }
        return next();
    }
}

module.exports = {apiKey, permission}