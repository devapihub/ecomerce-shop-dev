import mongoose from 'mongoose';
import config from '../configs/config.mongodb.js';
const {db: {host, port, name, username, password}} = config;
const connectString = `mongodb://${username}:${password}@${host}:${port}/${name}?authSource=admin`;
import {countConnect} from '../helpers/check.connect.js';

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50
        })
            .then(_ => {
                console.log(`connected successfully mongodb at ${connectString}`);
                countConnect();
            })
            .catch(err => console.log(`error connecting mongodb`, err));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongoDb = Database.getInstance();
export default instanceMongoDb;