const { 
    controllerBringAll,
    controllerPostNewGame,
} = require('../controllers/controllersVideogames.js')

const handlerBringAll = async ( req, res ) =>{
    const idVideogame = req.params.id
    const nameToSearch = req.query.name
    try {
        const response = await controllerBringAll(idVideogame, nameToSearch)
        if( !response.length){
            return res.status(400).json({error: 'No data found'})
        }
        res.status(200).json(response)
    } catch (error) {
        console.error("Error in handlerBringAll: ", error);
        res.status(500).json({error: 'Internal server error'})
    }
}

const handlerNewGame = async ( req, res ) =>{
    try {
        const newGame = req.body
        const postNewGame = await controllerPostNewGame(newGame);

        if(!postNewGame.success){
            // retorna: 
            // { success: true, message: "The post has been created successfully." }
            // { success: false, message: "The post already exists in our records." }
            res.status(200).send(postNewGame.message)
        }
        else res.status(201).send(postNewGame.message)
    } catch (error) {
        console.error("Error in handlerNewGame: ", error); //error
        res.status(500).json({error: 'Internal server error'})
    }
} 

module.exports = {
    handlerBringAll,
    handlerNewGame,
}