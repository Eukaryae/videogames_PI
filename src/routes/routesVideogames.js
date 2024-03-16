const routesVideogames = require("express").Router()
const {
    handlerBringAll,
    // handlerBringByID,
    handlerNewGame,
    // handlerSearchName
} = require("../handlers/handlersVideogames.js")


routesVideogames.post("/", handlerNewGame);//ruta para crear o postear actividades
routesVideogames.get("/", handlerBringAll); // get all videogames
routesVideogames.get("/:id", handlerBringAll); // get videogames detail with an id
routesVideogames.get("/?name=", handlerBringAll)
module.exports = routesVideogames;