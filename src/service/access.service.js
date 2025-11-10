'use strict'

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const keyTokenService = require("./keyToken.service");
const {createTokenPair} = require("../auth/authUtils");
const {getInfoData} = require("../utils");
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {
    static async signup({name, email, password}) {
        try {
            // step 1: check if shop email already exists
            const holderShop = await shopModel.findOne({email}).lean();
            if (holderShop) {
                return {
                    code: 'xxx',
                    message: 'Shop email already exists',
                    status: 'error'
                }
            }

            const passwordHashed = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHashed,
                roles: [RoleShop.SHOP]
            });

            if (newShop) {
                // created privateKey, publicKey for shop here (omitted for brevity)
                /*const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                });*/

                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                console.log(privateKey, publicKey);
                const keyStore = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                });

                if (!keyStore) {
                    return {
                        code: 'xxx',
                        message: 'publicKeyString error',
                        status: 'error'
                    }
                }

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

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ['name'], object: newShop}),
                        tokens
                    },
                }
            }
            return {
                code: 200,
                metadata: null,
            }
        } catch (err) {
            console.error('Error in signup service:', err);
            return {
                code: 'xxxxxx',
                message: err.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;