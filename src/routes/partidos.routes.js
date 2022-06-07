const express = require('express');
const partidosController = require('../Controllers/partidos.controller');
const md_autenticacion = require('../middlewares/autenticacion');


var api = express.Router();

//rutas para Usuarios

api.post('/agregarPartido/:idJornada?', md_autenticacion.Auth, partidosController.agregarPartido);

api.put('/editarPartiddo/:idPartido?', md_autenticacion.Auth, partidosController.editarPartiddo);


module.exports = api;