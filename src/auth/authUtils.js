'use strict'

const JWT = require('jsonwebtoken');
const {asyncHandler} = require("../helpers/asyncHandler");
const {AuthFailureError, NotfoundError} = require("../core/error.response");
const {findByUserId} = require("../service/keyToken.service");
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'refreshtoken'
}
const createTokenPair = async (payload, pubicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, pubicKey, {
            expiresIn: "2 days"
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: "7 days"
        });

        JWT.verify(accessToken, pubicKey, (err, decode) => {
            if (err) {
                console.error(`error verify::`, err);
            } else {
                console.log(`decode verify::`, decode);
            }
        });
        return {accessToken, refreshToken}
    } catch (error) {
        return error
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
        throw new AuthFailureError('Invalid request!');
    }

    const keyStore = await findByUserId(userId);
    if (!keyStore) {
        throw new NotfoundError('Invalid request! No key store found');
    }

    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
            if (decodeUser.userId !== userId) {
                throw new AuthFailureError('Invalid request!');
            }
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (err) {
            throw err;
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
        throw new AuthFailureError('Invalid request!');
    }

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (decodeUser.userId !== userId) {
            throw new AuthFailureError('Invalid request!');
        }
        req.keyStore = keyStore;
        console.log(keyStore)
        return next();
    } catch (error) {
        throw error;
    }

});

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}