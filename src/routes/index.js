import express from 'express';
import {apiKey, permission} from "../auth/checkAuth.js";
const router = express.Router();

// check apiKey & permission //
router.use(apiKey);
router.use(permission('0000'));
/////////////////////////////////////////

import accessRoutes from './access/index.js';
import productRoutes from './product/index.js';
import discountRoutes from './discount/index.js';
import shopRoutes from './shop/index.js';
import ghnRoutes from './ghn/index.js';

router.use('/v1/api', accessRoutes);
router.use('/v1/api/product', productRoutes);
router.use('/v1/api/discount', discountRoutes);
router.use('/v1/api/shop', shopRoutes);
router.use('/v1/api/ghn', ghnRoutes);

export default router;