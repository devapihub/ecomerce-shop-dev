'use strict'

const express = require('express');
const accessController = require('../../controller/access.controller');
const {asyncHandler} = require("../../helpers/asyncHandler");
const productController = require("../../controller/product.controller");
const router = express.Router();

router.post('/shop/signup', asyncHandler(accessController.signup));
router.post('/shop/login', asyncHandler(accessController.login));

router.get('/product/search/:keySearch', asyncHandler(productController.getListSearchProduct));
router.get('/product', asyncHandler(productController.findAllProduct));
router.get('/product/:product_id', asyncHandler(productController.findProduct));

module.exports = router;