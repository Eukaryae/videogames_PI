const { genresInDataBase } = require('../controllers/controllersGenres.js')
const handlerBringGenres = async (req, res) =>{
    try {
        const getAlldata = await genresInDataBase()
        // console.log(getAlldata)
        res.send(getAlldata)
    } catch (error) {
        console.error("Error in getAlldata: ", error);
        res.status(500).json({error: 'Internal server error'})
    }

}

module.exports = {
    handlerBringGenres
}