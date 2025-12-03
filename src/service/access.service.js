import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import KeyTokenService from "./keyToken.service.js";
import {createTokenPair, verifyJWT} from "../auth/authUtils.js";
import {getInfoData} from "../utils/index.js";
import {BadRequestError, AuthFailureError, ForbiddenError} from "../core/error.response.js";
import {findByEmail, generateOTP, verifyOTP as verifyOTPService} from "./user.service.js";
import {OAuth2Client} from 'google-auth-library';
import EmailService from "./email.service.js";
import otpModel from '../models/otp.model.js';

class AccessService {
    static handlerRefreshToken = async ({keystore, user, refreshToken}) => {
        const {userId, email} = user;
        // console.log('refreshToken:', user);
        console.log('keystore:', keystore);

        if (keystore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyByUserId(userId);
            throw new ForbiddenError('Something wrong happen. Please re-login!');
        }

        if (keystore.refreshToken !== refreshToken) {
            throw new AuthFailureError('User not registered!');
        }

        const foundUser = await findByEmail({email});
        if (!foundUser) {
            throw new BadRequestError('User not registered!');
        }

        const tokens = await createTokenPair(
            {
                userId: foundUser._id,
                email
            },
            keystore.publicKey,
            keystore.privateKey
        );

        await KeyTokenService.addRefreshTokenToUsed(keystore, tokens.refreshToken, refreshToken);

        return {
            user: {userId, email},
            tokens
        }
    }
    static logout = async (keystore) => {
        const delKey = await KeyTokenService.removeKeyById(keystore._id);
        console.log('delete key result::', delKey);
        return delKey;
    }

    static login = async ({email, password}) => {
        const foundUser = await findByEmail({email});
        if (!foundUser) {
            throw new BadRequestError('User not registered!');
        }

        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) {
            throw new AuthFailureError('Authentication failed! Password not correct');
        }

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const tokens = await createTokenPair(
            {
                userId: foundUser._id,
                email
            },
            publicKey,
            privateKey
        );

        await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey
        });

        return {
            user: getInfoData({fields: ['full_name', '_id', 'email', 'avatar'], object: foundUser}),
            tokens
        }
    }

    static async sendOTP({name, email, password}) {
        const holderUser = await userModel.findOne({email}).lean();
        if (holderUser) {
            throw new BadRequestError('Error: User already registered!');
        }

        const passwordHashed = await bcrypt.hash(password, 10);

        const otpCode = await generateOTP({
            email: email,
            length: 6,
            expiresInMinutes: 10,
            type: 'signup'
        });

        await otpModel.findOneAndUpdate(
            {email, type: 'signup'},
            {
                signupData: {
                    full_name: name,
                    password: passwordHashed
                }
            },
            {new: true, upsert: true}
        );
        
        await EmailService.sendOTP({
            to: email,
            otpCode: otpCode,
            userName: name
        });

        return {
            message: 'OTP sent to email. Please verify to complete signup.',
            email: email
        }
    }

    static async verifyAndSignup({email, otpCode}) {
        const otpRecord = await otpModel.findOne({email, type: 'signup'});
        if (!otpRecord || !otpRecord.signupData) {
            throw new BadRequestError('Signup data not found. Please signup again.');
        }

        const isValid = await verifyOTPService({email, otpCode, type: 'signup'});
        
        if (!isValid) {
            throw new BadRequestError('Invalid or expired OTP code.');
        }

        const existingUser = await userModel.findOne({email}).lean();
        if (existingUser) {
            await otpModel.findOneAndDelete({email, type: 'signup'});
            throw new BadRequestError('User already registered!');
        }

        const newUser = await userModel.create({
            full_name: otpRecord.signupData.full_name,
            email: email,
            password: otpRecord.signupData.password,
            provider: 'local',
            status: 'active',
            verify: true
        });

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const tokens = await createTokenPair(
            {
                userId: newUser._id,
                email
            },
            publicKey,
            privateKey
        );
        
        const keyStore = await KeyTokenService.createKeyToken({
            userId: newUser._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        });

        if (!keyStore) {
            throw new BadRequestError('publicKeyString error!');
        }

        return {
            user: getInfoData({fields: ['full_name', '_id', 'email', 'avatar', 'verify'], object: newUser}),
            tokens
        }
    }

    static async forgotPassword({email}) {
        const foundUser = await findByEmail({email});
        if (!foundUser) {
            return {
                message: 'Không tìm thấy email trong hệ thống.'
            };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date();
        resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Hết hạn sau 1 giờ

        await otpModel.findOneAndUpdate(
            {email, type: 'reset_password'},
            {
                email,
                otpCode: resetToken,
                otpExpires: resetTokenExpires,
                type: 'reset_password'
            },
            {new: true, upsert: true}
        );

        await EmailService.sendResetPasswordEmail({
            to: email,
            resetToken: resetToken,
            userName: foundUser.full_name 
        });

        return {
            message: 'Link đặt lại mật khẩu đã được gửi.'
        };
    }

    static async resetPassword({token, newPassword}) {
        const resetRecord = await otpModel.findOne({
            otpCode: token,
            type: 'reset_password',
            otpExpires: {$gt: new Date()}
        }).lean();

        if (!resetRecord) {
            throw new BadRequestError('Token không hợp lệ hoặc đã hết hạn.');
        }

        const foundUser = await findByEmail({email: resetRecord.email});
        if (!foundUser) {
            throw new BadRequestError('User không tồn tại.');
        }

        const passwordHashed = await bcrypt.hash(newPassword, 10);

        await userModel.findByIdAndUpdate(
            foundUser._id,
            {password: passwordHashed},
            {new: true}
        );

        await otpModel.findOneAndDelete({
            otpCode: token,
            type: 'reset_password'
        });

        return {
            message: 'Đặt lại mật khẩu thành công.'
        };
    }

    static googleLogin = async ({token}) => {
        try {
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const {email, name, picture, email_verified} = payload;

            let user = await findByEmail({email});
            
            if (!user) {
                // Tạo user mới nếu chưa tồn tại
                // verify sẽ tự động = false (vì provider = 'google')
                // Nhưng nếu email_verified = true từ Google, ta sẽ set verify = true
                user = await userModel.create({
                    full_name: name,
                    email,
                    provider: 'google',
                    avatar: picture || '',
                    verify: email_verified || false,  // Set verify từ email_verified của Google
                    status: 'active'
                });
            } else {
                // Cập nhật provider và verify nếu user đã tồn tại
                if (user.provider !== 'google') {
                    user = await userModel.findByIdAndUpdate(
                        user._id,
                        {
                            provider: 'google',
                            avatar: picture || user.avatar || '',
                            verify: email_verified !== undefined ? email_verified : user.verify
                        },
                        {new: true}
                    );
                } else if (email_verified !== undefined && !user.verify) {
                    // Cập nhật verify nếu email đã được verify bởi Google
                    user = await userModel.findByIdAndUpdate(
                        user._id,
                        {verify: email_verified},
                        {new: true}
                    );
                }
            }

            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            const tokens = await createTokenPair(
                {
                    userId: user._id,
                    email
                },
                publicKey,
                privateKey
            );

            await KeyTokenService.createKeyToken({
                userId: user._id,
                refreshToken: tokens.refreshToken,
                privateKey,
                publicKey
            });

            return {
                user: getInfoData({fields: ['full_name', '_id', 'email', 'avatar', 'verify'], object: user}),
                tokens
            }
        } catch (error) {
            throw new AuthFailureError('Token Google không hợp lệ: ' + error.message);
        }
    }
}

export default AccessService;