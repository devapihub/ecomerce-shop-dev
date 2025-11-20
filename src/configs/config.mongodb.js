'use strict'

const development = {
    app: {
        port: process.env.DEV_APP_PORT || 3055
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || '27017',
        name: process.env.DEV_DB_NAME || 'shop_dev',
        username: process.env.PROD_DB_USERNAME || undefined,
        password: process.env.PROD_DB_PASSWORD || undefined
    }
}

const production = {
    app: {
        port: process.env.PROD_APP_PORT || 3000
    },
    db: {
        host: process.env.PROD_DB_HOST || '61.14.234.12',
        port: process.env.PROD_DB_PORT || '27017',
        name: process.env.PROD_DB_NAME || 'shop_dev',
        username: process.env.PROD_DB_USERNAME,
        password: process.env.PROD_DB_PASSWORD
    }
}
const config = {development, production}
const env = process.env.NODE_ENV || 'development';
module.exports = config[env];