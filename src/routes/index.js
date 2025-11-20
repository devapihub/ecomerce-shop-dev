'use strict'

const express = require('express');
const {apiKey, permission} = require("../auth/checkAuth");
const router = express.Router();
const {authentication} = require("../auth/authUtils");

// check apiKey & permission //
router.use(apiKey);
router.use(permission('0000'));
/////////////////////////////////////////


router.use('/v1/api', require('./access'));

/*
// authentication //
router.use(authentication)
//////////////////////////

router.use('/v1/api', require('./shop'));
router.use('/v1/api/product', require('./product'));
*/

module.exports = router;