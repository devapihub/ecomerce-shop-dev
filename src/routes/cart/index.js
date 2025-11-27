'use strict'

const express = require('express');
const {asyncHandler} = require("../../helpers/asyncHandler");
const router = express.Router();
const {authentication} = require("../../auth/authUtils");
const {CartController} = require("../../controller/cart.controller");

router.post('', asyncHandler(CartController.addToCard));
router.delete('', asyncHandler(CartController.delete));
router.post('/update', asyncHandler(CartController.update));
router.get('', asyncHandler(CartController.listToCard));

module.exports = router;
