const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    DATABASE_URL: process.env.DATABASE_URL ||
    (process.env.NODE_ENV === 'production' ? 'mongodb://localhost/scorepolitic' : 'mongodb://localhost/scorepolitic-test'),
    PORT: process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',

    BOT_CONSUMER_KEY: process.env.BOT_CONSUMER_KEY,
    BOT_CONSUMER_SECRET: process.env.BOT_CONSUMER_SECRET,
    BOT_ACESS_TOKEN: process.env.BOT_ACESS_TOKEN,
    BOT_ACESS_TOKEN_SECRET: process.env.BOT_ACESS_TOKEN_SECRET,
}