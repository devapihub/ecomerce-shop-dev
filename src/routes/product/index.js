import express from 'express';
import productController from '../../controller/product.controller.js';
import {asyncHandler} from "../../helpers/asyncHandler.js";
const router = express.Router();
import {authentication} from "../../auth/authUtils.js";

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

export default router;