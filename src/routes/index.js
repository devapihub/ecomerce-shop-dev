'use strict'

const express = require('express');
const router = express.Router();

router.use('/v1/api', require('./access'));
router.use('/v1/api', (req, res) => {
    return res.status(200).json({ message: 'Welcome API' });
});

module.exports = router;