require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require("helmet");
const compression = require("compression");

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// init db
require('./dbs/init.mongodb');
const {checkOverload} = require('./helpers/check.connect');
const e = require("express");
checkOverload();

// init routes
app.use('/', require('./routes'));

// handling errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    console.error(err)
    return res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
})

module.exports = app