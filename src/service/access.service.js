'use strict'

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const keyTokenService = require("./keyToken.service");
const {createTokenPair, verifyJWT} = require("../auth/authUtils");
const {getInfoData} = require("../utils");
const {BadRequestError, AuthFailureError, ForbiddenError} = require("../core/error.response");
const {findByEmail} = require("./shop.service");
const {OAuth2Client} = require('google-auth-library');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {
    static handlerRefreshToken = async ({keystore, user, refreshToken}) => {
        const {userId, email} = user;
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

    static googleLogin = async ({token}) => {
        try {
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            
            // Verify token Google gửi lên
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            // Lấy thông tin user
            const payload = ticket.getPayload();
            const {email, name, picture} = payload;

            // Kiểm tra shop có tồn tại chưa
            let shop = await findByEmail({email});
            
            if (!shop) {
                // Tạo shop mới nếu chưa tồn tại
                shop = await shopModel.create({
                    name,
                    email,
                    password: '', // Không cần password cho OAuth
                    provider: 'google',
                    avatar: picture || '',
                    roles: [RoleShop.SHOP],
                    verify: true,
                    status: 'active'
                });
            } else {
                // Cập nhật provider nếu shop đã tồn tại
                if (!shop.provider) {
                    shop.provider = 'google';
                    shop.avatar = picture || shop.avatar || '';
                    await shop.save();
                }
            }

            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            const tokens = await createTokenPair(
                {
                    userId: shop._id,
                    email
                },
                publicKey,
                privateKey
            );

            await keyTokenService.createKeyToken({
                userId: shop._id,
                refreshToken: tokens.refreshToken,
                privateKey,
                publicKey
            });

            return {
                shop: getInfoData({fields: ['name', '_id', 'email', 'avatar'], object: shop}),
                tokens
            }
        } catch (error) {
            throw new AuthFailureError('Token Google không hợp lệ: ' + error.message);
        }
    }
}

module.exports = AccessService;