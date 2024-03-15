const {
    handlerBringGenres
} = require("../handlers/handlersGenres.js")

const routesGenres = require("express").Router()

// routesActivities.post("/", handlerPostActivity);//ruta para crear o postear actividades
routesGenres.get("/", handlerBringGenres); // obtiene todos los genres
// routesActivities.delete("/:id", handlerDeleteActivity); // borrar actividad pasando el id

module.exports = routesGenres;