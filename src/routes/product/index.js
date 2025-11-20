'use strict'

const express = require('express');
const productController = require('../../controller/product.controller');
const {asyncHandler} = require("../../helpers/asyncHandler");
const router = express.Router();

router.post('', asyncHandler(productController.createProduct));
router.patch('/:product_id', asyncHandler(productController.updateProduct));
router.delete('/:product_id', asyncHandler(productController.deleteProduct));
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop));

router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get('/published/all', asyncHandler(productController.getAllPublishForShop));

module.exports = router;