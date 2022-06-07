const Usuarios = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const md_autenticacion = require('../middlewares/autenticacion');

function AdminInicial() {
  var usuarioModel = new Usuarios();

  usuarioModel.nombre = 'ADMIN';
  usuarioModel.usuario = 'ADMIN';
  usuarioModel.rol = 'Admin';

  Usuarios.find((err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {

          bcrypt.hash('deportes123', null, null, (err, paswordEncriptada) => {
              usuarioModel.password = paswordEncriptada;
          });

          usuarioModel.save()
      }
  })
}


function AgregarAdmin(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuarios();

    console.log(req.user.rol)
    if (req.user.rol == 'Usuario' || req.user.rol == 'ADMIN') {
        return res.status(500).send({ mensaje: 'Este Usuario no esta autorizado ' });
    } else {
        if (parametros.nombre && parametros.usuario && parametros.password) {
            usuarioModel.nombre = parametros.nombre;
            usuarioModel.usuario = parametros.usuario;
            usuarioModel.rol = 'ADMIN';

            Usuarios.find({ usuario: parametros.usuario }, (err, usuarioEcontrado) => {
                if (usuarioEcontrado == 0) {

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500).send({ message: 'Error en la peticion' });
                            if (!usuarioGuardado) return res.status(404).send({ message: 'No fue posible encontrar usuarios' });

                            return res.status(200).send({ usuario: usuarioGuardado });
                        });
                    });
                } else {
                    return res.status(500).send({ mensaje: 'El usuario ya se encuentra registrado' });
                }

            })
        } else {
            return res.status(500).send({ mensaje: 'Faltan campos por completar!' })
        }
    }
}


function Login(req, res) {
    var parametros = req.body;

    Usuarios.findOne({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en esta peticion" });

        if (usuarioEncontrado) {
            bcrypt.compare(parametros.password, usuarioEncontrado.password, (err, verificacionPassword) => {
                if (verificacionPassword) {
                    if (parametros.obtenerToken === 'true') {
                        return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) })
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuario: usuarioEncontrado })
                    }
                } else {
                    return res.status(500).send({ mensaje: 'la clave no coincide' })
                }
            })

        } else {
            return res.status(500).send({ mensaje: "Error, este usuario no se encuentra registrado" })
        }
    })
}



function RegistrarUsuario(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuarios();

    if (parametros.nombre, parametros.usuario, parametros.password) {
        usuarioModel.nombre = parametros.nombre;
        usuarioModel.usuario = parametros.usuario;
        usuarioModel.rol = "Usuario";

        Usuarios.find({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.length == 0) {

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;
                });

                usuarioModel.save((err, usuarioGuardado) => {
                    if (err) return res.status(500).send({ mensaje: "Error en esta peticion" });
                    if (!usuarioGuardado) return res.status(400).send({ mensaje: "Error al agregar usuario" });
                    return res.status(200).send({ usuario: usuarioGuardado });
                })
            } else {
                return res.status(500).send({ mensaje: 'Este usuario ya esta utilizado' })
            }
        })
    }
}




function EditarUsuario(req, res) {
    var idUser = req.params.idUsuario;
    var parametros = req.body;

    if (req.user.rol == 'Admin' || idUser === req.user.sub) {
        Usuarios.findById(idUser, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.rol == 'Usuario' && req.user.sub === idUser) {
                parametros.rol = 'Usuario';
                Usuarios.findByIdAndUpdate(idUser, parametros, { new: true }, (err, usuarioEditado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioEditado) return res.status(404).send({ mensaje: 'Error al Editar el usuario' })
                    return res.status(200).send({ usuario: usuarioEditado });
                })
            } else if (usuarioEncontrado.rol == 'Usuario' && req.user.rol == 'Admin') {
                Usuarios.findByIdAndUpdate(idUser, parametros, { new: true }, (err, usuarioEditado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioEditado) return res.status(404).send({ mensaje: 'Error al Editar el usuario' })
                    return res.status(200).send({ usuario: usuarioEditado });
                })
            } else {
                return res.status(500).send({ mensaje: 'no esta autorizado para editar' });
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'no esta autorizado para editar' });
    }
}




function EliminarUsuario(req, res) {
    var idUser = req.params.idUsuario;
    if (idUser === req.user.sub || req.user.rol == 'Admin') {
        Usuarios.findById(idUser, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.rol == 'Usuario' && req.user.sub === idUser) {
                Usuarios.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioEliminado) return res.status(404).send({ mensaje: 'Error al Eliminar el usuario' })
                    return res.status(200).send({ Usuario: usuarioEliminado });
                })
            } else if (usuarioEncontrado.rol == 'Usuario' && req.user.rol == 'Admin') {
                Usuarios.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioEliminado) return res.status(404).send({ mensaje: 'Error al Eliminar el usuario' })
                    return res.status(200).send({ Usuario: usuarioEliminado });
                })
            } else {
                return res.status(500).send({ mensaje: 'no esta autorizado para Eliminar' });
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para eliminar' });
    }
}



function verUsuarios(req, res) {
    if (req.user.rol == 'Admin') {
        Usuarios.find((err, usuariosEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!usuariosEncontrados) return res.status(404).send({ mensaje: 'Error al obtener los usuarios' });

            return res.status(200).send({ usuarios: usuariosEncontrados });

        })
    }
}

function verUsuariosId(req, res) {
    var idUser = req.params.idUsuario;

    Usuarios.findById(idUser, (err, usuarioEcontrado) => {

        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!usuarioEcontrado) return res.status(404).send({ mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ usuarios: usuarioEcontrado });
    })
}

function verUsuariosNombre(req, res) {
    var nombreBuscar  = req.params.nombreBuscar;

    Usuarios.find({ usuario: { $regex: nombreBuscar, $options: 'i' } }, (err, usuarioEcontrado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!usuarioEcontrado) return res.status(404).send({ message: 'error al obtener usuarios' });

        return res.status(200).send({ usuarios: usuarioEcontrado });
    })


}



module.exports = {
    Login,
    AdminInicial,
    RegistrarUsuario,
    EditarUsuario,
    EliminarUsuario,
    verUsuarios,
    verUsuariosId,
    verUsuariosNombre,
    AgregarAdmin

}