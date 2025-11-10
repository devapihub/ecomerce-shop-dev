'use strict'
const accessService = require('../service/access.service');

class AccessController {
    async signup(req, res) {
        try {
            console.log('Signup request body:', req.body);
            return res.status(201).json(await accessService.signup(req.body));
        } catch (error) {
            console.error('Error in signup:', error);
            return res.status(500).json({message: 'Internal Server Error'});
        }
    }
}

module.exports = new AccessController();