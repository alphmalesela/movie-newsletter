require('dotenv').config()

const config = {
    SQLITE_STORAGE : process.env.SQLITE_STORAGE,
    SESSION_SECRET: process.envSESSION_SECRET,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    TMDB_URL: process.env.TMDB_URL,
    TMDB_AUTH_TOKEN: process.env.TMDB_AUTH_TOKEN
};

export {
    config
}