require('dotenv').config();
const axios = require('axios')
const { Videogames, Genres } = require('../db.js')
const { Op } = require("sequelize");
const { API_URL, API_KEY } = process.env;
const importss = require('../../../../videogames100.json')
const {createGenreInDB} = require('../controllers/controllersGenres.js')

// let identification = 100;
const controllerBringAll = async (idVideogame, nameToSearch) => {
    if(idVideogame){
        return controllerByID(idVideogame)
    }
    if(nameToSearch){
        return controllerSearchedName(nameToSearch)
    }
    const response_DB = await getData_DB();
    const response_API = await getData_API();
    const response = [...response_DB, ...response_API]
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
        const videogamesData = response.map(({id, name, image, rating, genres}) =>{
            return {
                id: id,
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
            // ...element.toJSON(),// Convertir el objeto Sequelize a un objeto plano
            id: element.id,
            name: element.name,
            image: element.image,
            rating: element.rating,
            // genres: element.genres.map(({name}) => name),
            genres: element.genres.map((genre)=> genre.name),
            created: element.created,
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
    // const cleanResponse = cleanerFunction(response)
    // const cleanResponse = cleanerFunction([response])
    const cleanResponse = {
        name: response.name,
        image: response.background_image,
        image_background: response.background_image_additional || "",
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
    
const controllerSearchedName = async ( nameToSearch ) =>{
    const responseAPI = (await axios.get(`${API_URL}?key=${API_KEY}&search=${nameToSearch}`)).data.results
    // if(!responseAPI.length) throw new Error ("Couldn't get search info from server")

    const responseDB = await Videogames.findAll({
        where : { 
            "name" : {
                
                [Op.iLike]: "%" + nameToSearch + "%" 
            },
        },
        include : [{
            model: Genres,
            attributes: ['name'],
            through: {
                attributes: []
            },
            // //     attributes: ['name', 'image_background'],
        }]

    })
    // if(!responseDB.length) throw new Error ("Couldn't get search info from server")
    const response = [...responseDB, ...responseAPI]
    // if(!response.length) return false

    const modifiedResponse = response.map(element => {
        return {
            // ...element.toJSON(),// Convertir el objeto Sequelize a un objeto plano
            id: element.id,
            name: element.name,
            image: element.image,
            rating: element.rating,
            // genres: element.genres.map(({name}) => name),
            genres: typeof(element.genres[0]) !== "string" ? element.genres.map((genre)=> genre.name) : element.genre,
            created: element.created,
        }
    });
    
    return modifiedResponse;
    // return response
}
    
module.exports = {
    controllerBringAll,
    controllerPostNewGame
}