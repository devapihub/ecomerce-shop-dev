'use strict'

const {SuccessResponse} = require("../core/success.response");
const {createApiKey} = require("../service/apiKey.service");


class ApiKeyController {
    async createApiKey(req, res, next) {
        new SuccessResponse({
            message: 'Create new api key success',
            metadata: await createApiKey()
        }).send(res);
    }
}

module.exports = new ApiKeyController();