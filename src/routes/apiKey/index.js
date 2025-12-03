import express from 'express';
import apiKeyController from '../../controller/apiKey.controller.js';
import {asyncHandler} from "../../helpers/asyncHandler.js";
const router = express.Router();

router.post('', asyncHandler(apiKeyController.createApiKey));

export default router;
