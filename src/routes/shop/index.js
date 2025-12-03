import express from 'express';
const router = express.Router();
import { authentication } from "../../auth/authUtils.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import shopController from '../../controller/shop.controller.js';
import upload from '../../utils/uploadMulter.js';

router.get('/search', asyncHandler(shopController.searchShopsByName));
router.get('/all', asyncHandler(shopController.getAllShops));
router.get('/my-shop', authentication, asyncHandler(shopController.getMyShop));
router.get('/slug/:slug', asyncHandler(shopController.getShopBySlug));
router.get('/id/:shop_id', asyncHandler(shopController.getShopById));

router.post(
  '/create-shop',
  authentication,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  asyncHandler(async (req, res, next) => {
    await shopController.createShop(req, res, next);
  })
);


router.patch('/id/:shop_id', 
    authentication,
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'banner', maxCount: 1 }
    ]),
    asyncHandler(shopController.updateShop)
);
router.delete('/id/:shop_id', authentication, asyncHandler(shopController.deleteShop));

export default router;