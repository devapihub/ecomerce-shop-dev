'use strict'

const nodemailer = require('nodemailer');

class EmailService {
    // Tạo transporter (cấu hình email)
    static createTransporter() {
        return nodemailer.createTransport({
            // Option 1: Gmail (dùng App Password)
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASSWORD 
            }
            
            // Option 2: SMTP Server 
            // host: process.env.SMTP_HOST,
            // port: process.env.SMTP_PORT || 587,
            // secure: false, 
            // auth: {
            //     user: process.env.SMTP_USER,
            //     pass: process.env.SMTP_PASSWORD
            // }
        });
    }

    static async sendOTP({to, otpCode}) {
        const transporter = this.createTransporter();

        const mailOptions = {
            from: `"Ecommerce Shop" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: 'Mã OTP xác thực email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <p>Mã OTP của bạn là:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #ff6b35; font-size: 32px; letter-spacing: 5px; margin: 0;">${otpCode}</h1>
                    </div>
                    <p>Mã này sẽ hết hạn sau 10 phút.</p>
                    <p style="color: #666; font-size: 12px;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                </div>
            `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ', info.messageId);
            return {success: true, messageId: info.messageId};
        } catch (error) {
            console.error('Error sending email: ', error);
            throw new Error('Failed to send email: ' + error.message);
        }
    }

    static async sendResetPasswordEmail({to, resetToken, userName}) {
        const transporter = this.createTransporter();
        const resetUrl = `${process.env.CLIENT_URL}/auth?tab=reset-password&token=${resetToken}`;

        const mailOptions = {
            from: `"Ecommerce Shop" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: 'Đặt lại mật khẩu',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Xin chào ${userName}!</h2>
                    <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
                    <p>Nhấn vào link sau để đặt lại mật khẩu:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #ff6b35; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Đặt lại mật khẩu</a>
                    <p style="color: #666; font-size: 12px;">Link này sẽ hết hạn sau 1 giờ.</p>
                </div>
            `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            return {success: true, messageId: info.messageId};
        } catch (error) {
            console.error('Error sending email: ', error);
            throw new Error('Failed to send email: ' + error.message);
        }
    }
}

module.exports = EmailService;