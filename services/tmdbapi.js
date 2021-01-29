const { config } = require('../config');
const { randomNum } = require('./helper');
const fetch = require('node-fetch');

class TMDBAPI {

    async fetchRandomMovie() {
        const randomMovieId = randomNum().toString();
        let movie = null;
        
        async function fetchMovie() {
            const resp = await fetch(config.TMDB_URL+randomMovieId,{
                headers: {
                    'Authorization': `Bearer ${config.TMDB_AUTH_TOKEN}`,
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });
            const body = await resp.json();
            if (resp.status == 200) {
                movie = body;
            } else {
              await fetchMovie();
            }
        }
        await fetchMovie();
        return movie;
    }
    
}

module.exports = TMDBAPI;