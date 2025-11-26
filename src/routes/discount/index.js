'use strict'

const express = require('express');
const {asyncHandler} = require("../../helpers/asyncHandler");
const router = express.Router();
const {authentication} = require("../../auth/authUtils");
const {DiscountController} = require("../../controller/discount.controller");

router.get('/amount', asyncHandler(DiscountController.getDiscountAmount));
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodeWithProduct));

router.post('', authentication, asyncHandler(DiscountController.createDiscountCode));
router.get('', authentication, asyncHandler(DiscountController.getAllDiscountCodes));

module.exports = router;
