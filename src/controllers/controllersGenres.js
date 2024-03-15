const { Videogames, Genres } = require('../db.js')

const createGenreInDB = async (response) =>{
    
    // let arrAllGenres = []
    let uniqueGenreNames = new Set();
    
    // for (const element of response) {
    //     element.genres.map(async (genre)=> {
    //         if(!uniqueGenreNames.has(genre.name)){
    //             uniqueGenreNames.add(genre.name)
    //             // await Genres.findOrCreate({
    //             await Genres.create({
    //                 // where: {name: genre.name},
    //                 name: genre.name,
    //                 image_background: genre.image_background
    //             })
    //         }
    //     })
    // }
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