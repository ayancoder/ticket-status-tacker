const path = require('path');
const dotenv = require('dotenv');

module.exports = {
    NODE_ENV : process.env.NODE_ENV,
    HOST : process.env.HOST,
    PORT : process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,

    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRECT_ACCESS_KEY: process.env.S3_SECRECT_ACCESS_KEY,
    S3_BUCKET_REGION: process.env.S3_BUCKET_REGION
}