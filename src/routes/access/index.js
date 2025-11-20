'use strict'

const express = require('express');
const accessController = require('../../controller/access.controller');
const {asyncHandler} = require("../../helpers/asyncHandler");
const {authentication} = require("../../auth/authUtils");
const router = express.Router();

router.post('/shop/signup', asyncHandler(accessController.signup));
router.post('/shop/login', asyncHandler(accessController.login));
router.post('/shop/google', asyncHandler(accessController.googleLogin));

// authentication //
router.use(authentication)
///////////////////

router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/refresh-token', asyncHandler(accessController.handleRefreshToken));

module.exports = router;