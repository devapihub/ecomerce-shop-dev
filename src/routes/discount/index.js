import express from 'express';
import {asyncHandler} from "../../helpers/asyncHandler.js";
const router = express.Router();
import {authentication} from "../../auth/authUtils.js";
import {DiscountController} from "../../controller/discount.controller.js";

router.get('/amount', asyncHandler(DiscountController.getDiscountAmount));
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodeWithProduct));
router.post('/cancel/:code', authentication, asyncHandler(DiscountController.cancelDiscount));
router.delete('/:code', authentication, asyncHandler(DiscountController.deleteDiscount));
router.post('', authentication, asyncHandler(DiscountController.createDiscountCode));
router.get('', authentication, asyncHandler(DiscountController.getAllDiscountCodes));

export default router;
