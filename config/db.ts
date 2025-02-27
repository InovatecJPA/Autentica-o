import { Sequelize } from 'sequelize';
// @ts-ignore
import dbConfig from './config.js';

import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const config = dbConfig[environment];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        logging: config.logging,
    }
);

export default sequelize;
