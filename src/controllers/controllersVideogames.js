require('dotenv').config();
const axios = require('axios')
const { Videogames, Genres } = require('../db.js')
const { Op } = require("sequelize");
const { API_URL, API_KEY } = process.env;
const importss = require('../../../../videogames100.json')
const {createGenreInDB} = require('../controllers/controllersGenres.js')

let identification = 100;
const controllerBringAll = async () => {
    const response_DB = await getData_DB();
    const response_API = await getData_API();
    const response = [...response_DB, ...response_API]
    // return response_DB
    return response
}

const getData_API = async () =>{
    
    // const limit = 100;
    // const perPage = 20
    
    // let response = []
    // for(let i=1; i<=5; i++){
        
        //     const arrResults = (await axios.get(`${API_URL}?key=${API_KEY}&page=${i}`)).data
        //     response = response.concat(arrResults.results)
        // }
    const response = importss
    const videogamesData = response.map(({name, image, rating, genres}) =>{
        return {
            id: identification++,
            name: name,
            image: image,
            rating: rating,
            genres: genres.map(({name}) => name),
            created: false,
        }
    })
    const createdGenres = createGenreInDB(response)
    return videogamesData
}
const getData_DB = async () => {
    const response = await Videogames.findAll({
        include : [{
            model: Genres,
            attributes: ['name'],
        // //     attributes: ['name', 'image_background'],
            through: {
                attributes: []
            },
        }]
    })
    const modifiedResponse = response.map(element => {
        return {
            ...element.toJSON(),// Convertir el objeto Sequelize a un objeto plano
            genres: element.genres.map((genre)=> genre.name)
        }
    });
    return modifiedResponse;
}

const controllerByID = async ( idVideogame ) => {
    if(isNaN(idVideogame)){
        const response = await detail_DB(idVideogame)
        return response
    }
    const response = await detail_API(idVideogame)
    return response
}

const detail_DB = async ( idVideogame ) => {
    const response = await Videogames.findByPk(idVideogame);
    if(!response) throw new Error ("Couldn't find that videogame")
    return response
}

const detail_API = async ( idVideogame ) => {
    const response = (await axios.get(`${API_URL}/${idVideogame}?key=${API_KEY}`)).data
    if(!response) throw new Error ("Couldn't get detail info from server")
    const cleanResponse = {
        name: response.name,
        image: response.background_image,
        image_background: response.background_image_additional,
        platforms: response.platforms.map((el)=> el.platform.name),
        description: response.description_raw,
        released: response.released,
        rating: response.rating,
        genres: response.genres.map(({name})=> name)
    }
    return cleanResponse
}

    //id, name, background_image, description, platform, released, rating//// genres
const controllerPostNewGame = async ( newGame ) =>{
    const [game, created] = await Videogames.findOrCreate({
        where: { name: newGame.name},
        defaults: {
        name: newGame.name,
        image: newGame.image,
        image_background: newGame.image_background,
        platforms: newGame.platforms,
        description: newGame.description,
        released: newGame.released,
        rating: newGame.rating
        }
    })
    // tengo que iterar newGame.genres y por cada elemento dentro buscarlo por nombre en el modelo genres e ir dando addGenre o addGenres al modelo Videogames
    newGame.genres.length && await Promise.all(
        // Asociar la actividad creada con el o los países indicados
        newGame.genres.map( async (genre) => {
            //Busca en countries segun la id dentro de inCountries
            const genreName = await Genres.findOne({where: {name: genre}});
            // console.log(genreName);
            // // relaciona la actividad al país o paises donde se realiza
            genreName && await game.addGenre(genreName);
        })
    );
    if(!created) return { success: false, message: "The post already exists in our records." };
    return { success: true, message: "The post has been created successfully." };
}


module.exports = {
    controllerBringAll,
    controllerByID,
    controllerPostNewGame
}