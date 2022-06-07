const express = require('express');
const jornadasController = require('../Controllers/jornadas.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

api.post('/agregarJornada/:idLiga?/:idCreador?', md_autenticacion.Auth, jornadasController.agregarJornada);
api.get('/verJornadas/:idLiga?', md_autenticacion.Auth, jornadasController.VerJornadas);
api.put('/editarJornada/:idJornada?/:idLiga?/:idCreador?', md_autenticacion.Auth, jornadasController.editarJornada);
api.delete('/eliminarJornada/:idJornada?/:idLiga?/:idCreador?', md_autenticacion.Auth, jornadasController.eliminarJornada);



module.exports = api;