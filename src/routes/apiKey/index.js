'use strict'

const express = require('express');
const apiKeyController = require('../../controller/apiKey.controller');
const {asyncHandler} = require("../../helpers/asyncHandler");
const router = express.Router();

router.post('', asyncHandler(apiKeyController.createApiKey));

module.exports = router;
