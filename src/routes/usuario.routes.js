const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api= express.Router();

//agregarAdminNuevo
api.post('/AgregarAdmin',md_autenticacion.Auth, usuarioController.AgregarAdmin);
//login 
api.post('/login', usuarioController.Login);
//register
api.post('/registrar', usuarioController.RegistrarUsuario);
//editar
api.put('/editarUsuario/:idUsuario',md_autenticacion.Auth,usuarioController.EditarUsuario);
//eliminar
api.delete('/eliminarUsuario/:idUsuario',md_autenticacion.Auth,usuarioController.EliminarUsuario);
//ver usuarios
api.get('/verUsuarios',md_autenticacion.Auth,usuarioController.verUsuarios);
api.get('/verUsuariosId/:idUsuario', usuarioController.verUsuariosId);
api.get('/verUsuarioNombre/:nombreBuscar', usuarioController.verUsuariosNombre);


module.exports = api;