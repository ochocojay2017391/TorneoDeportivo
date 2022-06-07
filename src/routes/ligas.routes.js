
const express = require('express');
const ligasController = require('../Controllers/ligas.controller');
const md_autenticacion = require('../middlewares/autenticacion');


var api = express.Router();


api.post('/agregarLiga/:UsuarioCreador?', md_autenticacion.Auth, ligasController.agregarLiga);
api.put('/editarLiga/:idLiga?', md_autenticacion.Auth, ligasController.editarLiga);
api.delete('/eliminarLiga/:idLiga?', md_autenticacion.Auth, ligasController.eliminarLiga);
api.get('/verLigas', md_autenticacion.Auth,ligasController.verLigas);
api.get('/verLigasId/:idLiga?', md_autenticacion.Auth,ligasController.verLigasId);


module.exports = api;