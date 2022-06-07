const express = require('express');
const equiposController = require('../Controllers/equipos.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();


api.post('/agregarEquipo/:idLiga?/:idCreador?', md_autenticacion.Auth, equiposController.agregarEquipo);
api.put('/editarEquipo/:idLiga?/:idEquipo?/:idCreador?', md_autenticacion.Auth, equiposController.editarEquipo);
api.delete('/eliminarEquipo/:idLiga?/:idEquipo?/:idCreador?', md_autenticacion.Auth, equiposController.eliminarEquipo);
api.get('/verEquiposLiga/:idLiga?/:idCreador?', md_autenticacion.Auth, equiposController.verEquiposLiga);

module.exports = api;