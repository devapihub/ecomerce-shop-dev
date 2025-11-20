'use strict'

const express = require('express');
const productController = require('../../controller/product.controller');
const {asyncHandler} = require("../../helpers/asyncHandler");
const router = express.Router();
const {authentication} = require("../../auth/authUtils");

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));

router.get('', asyncHandler(productController.findAllProduct));
router.post('', authentication, asyncHandler(productController.createProduct));

router.get('/:product_id', asyncHandler(productController.findProduct));
router.patch('/:product_id', authentication, asyncHandler(productController.updateProduct));
router.delete('/:product_id', authentication, asyncHandler(productController.deleteProduct));

router.post('/publish/:id', authentication, asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', authentication, asyncHandler(productController.unPublishProductByShop));

router.get('/drafts/all', authentication, asyncHandler(productController.getAllDraftsForShop));
router.get('/published/all', authentication, asyncHandler(productController.getAllPublishForShop));

module.exports = router;