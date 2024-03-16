const { Videogames, Genres } = require('../db.js')
const axios = require('axios')
require('dotenv').config();
const { API_URL_GENRES, API_KEY } = process.env;
const createGenreInDB = async () =>{
    
const response = (await axios.get(`${API_URL_GENRES}?key=${API_KEY}`)).data.results
    for (const element of response) {
        for (const genre of element.genres) {
            await Genres.findOrCreate({
                where: { name: genre.name }, // Busca por el nombre del género
                defaults: {
                    name: genre.name,
                    image_background: genre.image_background
                }
            });
        }
    }
    const genresInDB = await Genres.findAll({})

    return genresInDB
}
const genresInDataBase = async () =>{
    const response = await Genres.findAll({})
    return response
}

module.exports = {
    createGenreInDB,
    genresInDataBase
}