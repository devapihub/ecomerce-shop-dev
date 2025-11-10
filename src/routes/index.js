'use strict'

const express = require('express');
const {apiKey} = require("../auth/checkAuth");
const router = express.Router();
// check apiKey
router.use(apiKey)
// check permission
router.use('/v1/api', require('./access'));
router.use('/v1/api', (req, res) => {
    return res.status(200).json({ message: 'Test CI/CD successfully' });
});

module.exports = router;