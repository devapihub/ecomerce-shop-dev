'use strict'
const accessService = require('../service/access.service');
const {OK, CREATED} = require('../core/success.response');

class AccessController {

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

    async signup(req, res) {
        new CREATED(
            {
                message: 'Signup successfully',
                metadata: await accessService.signup(req.body),
                options: {limit: 3}
            }
        ).send(res);
    }
}

module.exports = new AccessController();