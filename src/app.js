import dotenv from 'dotenv'; 
dotenv.config();
import express from 'express';
const app = express();
import morgan from 'morgan';
import helmet from "helmet";
import compression from "compression";

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// init db
import './dbs/init.mongodb.js';
import {checkOverload} from './helpers/check.connect.js';
checkOverload();

// init routes
import routes from './routes/index.js';
app.use('/', routes);

// handling errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    console.error(err)
    return res.status(err.status || 500).json({
        status: 'error',
        code: err.statusCode || 500,
        message: err.message || 'Internal Server Error'
    });
})

export default app;