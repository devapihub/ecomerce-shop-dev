import accessService from '../service/access.service.js';
import {OK, CREATED} from '../core/success.response.js';

class AccessController {

    async handleRefreshToken(req, res) {
        new OK({
            message: 'Get token successfully',
            metadata: await accessService.handlerRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keystore: req.keyStore
            })
        }).send(res);
    }

    async logout(req, res) {
        new OK({
            message: 'Logout successfully',
            metadata: await accessService.logout(req.keyStore)
        }).send(res);
    }

    async login(req, res) {
        new OK({
            message: 'Login successfully',
            metadata: await accessService.login(req.body)
        }).send(res);
    }

    async sendOTP(req, res) {
        new OK({
            message: 'OTP sent successfully',
            metadata: await accessService.sendOTP(req.body)
        }).send(res);
    }

    async verifyAndSignup(req, res) {
        new CREATED({
            message: 'Signup successfully',
            metadata: await accessService.verifyAndSignup(req.body),
            options: {limit: 3}
        }).send(res);
    }

    async googleLogin(req, res) {
        new OK({
            message: 'Login Google successfully',
            metadata: await accessService.googleLogin(req.body)
        }).send(res);
    }

    async forgotPassword(req, res) {
        new OK({
            message: 'Forgot password email sent',
            metadata: await accessService.forgotPassword(req.body)
        }).send(res);
    }

    async resetPassword(req, res) {
        new OK({
            message: 'Password reset successfully',
            metadata: await accessService.resetPassword(req.body)
        }).send(res);
    }
}

export default new AccessController();