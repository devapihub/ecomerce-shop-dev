import express from 'express';
const router = express.Router();
import { asyncHandler } from "../../helpers/asyncHandler.js";
import ghnController from '../../controller/ghn.controller.js';

router.get('/provinces', asyncHandler(ghnController.getProvinces));
router.get('/districts', asyncHandler(ghnController.getDistricts));
router.get('/wards', asyncHandler(ghnController.getWards));

export default router;

