const { config } = require('../config');
const { randomNum } = require('./helper');
const fetch = require('node-fetch');

class TMDBAPI {

    async fetchRandomMovie() {
        const randomMovieId = randomNum().toString();
        const resp = await fetch(config.TMDB_URL+randomMovieId,{
            headers: {
                'Authorization': `Bearer ${config.TMDB_AUTH_TOKEN}`,
                'Content-Type': 'application/json;charset=utf-8'
            }
        });
        const movie = await resp.json();  
        return movie;
    }
    
}

module.exports = TMDBAPI;