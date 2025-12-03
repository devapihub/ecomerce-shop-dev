import userModel from '../models/user.model.js';
import otpModel from '../models/otp.model.js';
import crypto from 'node:crypto';

const findByEmail = async ({email, select = {
    password: 1,
    email: 1,
    full_name: 1,
    status: 1,
    verify: 1,
    provider: 1,
    avatar: 1
}}) => {
    return await userModel.findOne({email}).select(select).lean();
}


const generateOTP = async ({email, length = 6, expiresInMinutes = 10, type = 'signup'}) => {
    const otpCode = crypto.randomInt(10 ** (length - 1), 10 ** length).toString().padStart(length, '0');
    
    // Tính thời gian hết hạn
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + expiresInMinutes);

    await otpModel.deleteMany({email, type});

    await otpModel.create({
        email,
        otpCode,
        otpExpires,
        type
    });

    return otpCode;
}

const verifyOTP = async ({email, otpCode, type = 'signup'}) => {
    const otpRecord = await otpModel.findOne({email, type});
    
    if (!otpRecord) {
        return false;
    }

    // Kiểm tra OTP đã hết hạn chưa
    if (new Date() > otpRecord.otpExpires) {
        await otpModel.findByIdAndDelete(otpRecord._id);
        return false;
    }

    // Kiểm tra OTP có đúng không
    if (otpRecord.otpCode !== otpCode) {
        return false;
    }

    // OTP hợp lệ - cập nhật verify của user (nếu là signup)
    if (type === 'signup') {
        const user = await userModel.findOne({email});
        if (user) {
            await userModel.findByIdAndUpdate(
                user._id,
                {verify: true}
            );
        }
    }

    // Xóa OTP sau khi verify thành công
    await otpModel.findByIdAndDelete(otpRecord._id);

    return true;
}

export {
    findByEmail,
    generateOTP,
    verifyOTP
};