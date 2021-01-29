require('dotenv').config()

const config = {
    SQLITE_STORAGE : process.env.SQLITE_STORAGE,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    TMDB_URL: process.env.TMDB_URL,
    TMDB_AUTH_TOKEN: process.env.TMDB_AUTH_TOKEN,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_HOST_PORT: process.env.EMAIL_HOST_PORT,
    EMAIL_AUTH_USER: process.env.EMAIL_AUTH_USER,
    EMAIL_AUTH_PASS: process.env.EMAIL_AUTH_PASS,
};

export {
    config
}