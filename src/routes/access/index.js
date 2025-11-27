'use strict'

const express = require('express');
const accessController = require('../../controller/access.controller');
const {asyncHandler} = require("../../helpers/asyncHandler");
const {authentication} = require("../../auth/authUtils");
const router = express.Router();

router.post('/shop/send-otp', asyncHandler(accessController.sendOTP));
router.post('/shop/verify-and-signup', asyncHandler(accessController.verifyAndSignup));
router.post('/shop/login', asyncHandler(accessController.login));
router.post('/shop/google', asyncHandler(accessController.googleLogin));
router.post('/shop/forgot-password', asyncHandler(accessController.forgotPassword));
router.post('/shop/reset-password', asyncHandler(accessController.resetPassword));

// authentication //
router.use(authentication)
///////////////////

router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/refresh-token', asyncHandler(accessController.handleRefreshToken));

module.exports = router;