const routesVideogames = require("express").Router()
const {
    handlerBringAll,
    handlerBringByID,
    handlerNewGame
} = require("../handlers/handlersVideogames.js")


routesVideogames.get("/", handlerBringAll); // get all videogames
routesVideogames.post("/", handlerNewGame);//ruta para crear o postear actividades
routesVideogames.get("/:id", handlerBringByID); // get videogames detail with an id

module.exports = routesVideogames;