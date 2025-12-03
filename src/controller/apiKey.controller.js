import {SuccessResponse} from "../core/success.response.js";
import {createApiKey} from "../service/apiKey.service.js";


class ApiKeyController {
    async createApiKey(req, res, next) {
        new SuccessResponse({
            message: 'Create new api key success',
            metadata: await createApiKey()
        }).send(res);
    }
}

export default new ApiKeyController();