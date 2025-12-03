import keyTokenModel from '../models/keytoken.model.js';
import {Types} from 'mongoose';

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            const filter = {user: userId}, update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken
            }, options = {upsert: true, new: true};
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({user: new Types.ObjectId(userId)}).lean();
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({_id: new Types.ObjectId(id)});
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshTokensUsed: refreshToken}).lean();
    }

    static deleteKeyByUserId = async (userId) => {
        return await keyTokenModel.findOneAndDelete({ user: new Types.ObjectId(String(userId)) });
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshToken});
    }

    static addRefreshTokenToUsed = async (holderToken, refreshToken, oldRefreshToken) => {
        await keyTokenModel.updateOne(
            { _id: holderToken._id },
            {
                $set: { refreshToken: refreshToken },
                $addToSet: { refreshTokensUsed: oldRefreshToken },
                $currentDate: { updatedAt: true }
            }
        );
    }
}

export default KeyTokenService;