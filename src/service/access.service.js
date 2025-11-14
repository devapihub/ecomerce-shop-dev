'use strict'

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const keyTokenService = require("./keyToken.service");
const {createTokenPair, verifyJWT} = require("../auth/authUtils");
const {getInfoData} = require("../utils");
const {BadRequestError, AuthFailureError, ForbiddenError} = require("../core/error.response");
const {findByEmail} = require("./shop.service");
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {
    static handlerRefreshToken = async ({keystore, user, refreshToken}) => {
        const {userId, email} = user;
        console.log(keystore)
        if (keystore.refreshTokensUsed.includes(refreshToken)) {
            await keyTokenService.deleteKeyByUserId(userId);
            throw new ForbiddenError('Something wrong happen. Please re-login!');
        }

        if (keystore.refreshToken !== refreshToken) {
            throw new AuthFailureError('Shop not registered!');
        }

        const foundShop = await findByEmail({email});
        if (!foundShop) {
            throw new BadRequestError('Shop not registered!');
        }

        const tokens = await createTokenPair(
            {
                userId: foundShop._id,
                email
            },
            keystore.publicKey,
            keystore.privateKey
        );

        await keyTokenService.addRefreshTokenToUsed(keystore, tokens.refreshToken, refreshToken);

        return {
            user: {userId, email},
            tokens
        }

        /*const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken);
        if (foundToken) {
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey);
            console.log('decoded::', userId, email);
            await keyTokenService.deleteKeyByUserId(userId);
            throw new ForbiddenError('Something wrong happen. Please re-login!');
        }

        const holderToken = await keyTokenService.findByRefreshToken(refreshToken);
        if (!holderToken) {
            throw new ForbiddenError('Shop not registered!');
        }

        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey);
        const foundShop = await findByEmail({email});
        if (!foundShop) {
            throw new BadRequestError('Shop not registered!');
        }

        const tokens = await createTokenPair(
            {
                userId: foundShop._id,
                email
            },
            holderToken.publicKey,
            holderToken.privateKey
        );

        await keyTokenService.addRefreshTokenToUsed(holderToken, tokens.refreshToken, refreshToken);

        return {
            user: {userId, email},
            tokens
        }*/
    }
    static logout = async (keystore) => {
        const delKey = await keyTokenService.removeKeyById(keystore._id);
        console.log('delete key result::', delKey);
        return delKey;
    }

    static login = async ({email, password, refreshToken = null}) => {
        const foundShop = await findByEmail({email});
        if (!foundShop) {
            throw new BadRequestError('Shop not registered!');
        }
        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new AuthFailureError('Authentication failed! Password not correct');
        }

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const tokens = await createTokenPair(
            {
                userId: foundShop._id,
                email
            },
            publicKey,
            privateKey
        );

        await keyTokenService.createKeyToken({
            userId: foundShop._id,
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey
        });

        return {
            shop: getInfoData({fields: ['name', '_id'], object: foundShop}),
            tokens
        }
    }

    static async signup({name, email, password}) {
        // step 1: check if shop email already exists
        const holderShop = await shopModel.findOne({email}).lean();
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered!');
        }

        const passwordHashed = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHashed,
            roles: [RoleShop.SHOP]
        });

        if (newShop) {
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            // create token pair
            const tokens = await createTokenPair(
                {
                    userId: newShop._id,
                    email
                },
                publicKey,
                privateKey
            );
            console.log(`created token success::`, tokens);

            console.log(privateKey, publicKey);
            const keyStore = await keyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken
            });

            if (!keyStore) {
                throw new BadRequestError('publicKeyString error!');
            }

            return {
                shop: getInfoData({fields: ['name', '_id'], object: newShop}),
                tokens
            }
        }
        return {
            code: 200,
            metadata: null,
        }
    }
}

module.exports = AccessService;