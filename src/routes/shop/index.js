'use strict'

const express = require('express');
const accessController = require('../../controller/access.controller');
const {asyncHandler} = require("../../helpers/asyncHandler");
const router = express.Router();

router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/refresh-token', asyncHandler(accessController.handleRefreshToken));

module.exports = router;