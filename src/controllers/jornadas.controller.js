const Jornadas = require('../models/jornadas.model');
const Equipos = require('../models/equipos.model');
const Ligas = require('../models/ligas.model');
const Usuarios = require('../models/usuario.model');

function agregarJornada(req, res) {
    var parametros = req.body;
    var joranadasModel = new Jornadas();
    if (req.user.rol == 'ADMIN') {
        Ligas = req.params.Ligas
        Creador = req.params.idCreador
    } else if (req.user.rol == 'Usuario') {
        Creador = req.user.sub;
        Ligas = req.params.Ligas;
    }

    var MaximaJornada;

    Equipos.find({ Ligas: Ligas }, (err, equipoEncontrado) => {
        if (!equipoEncontrado) return res.status(500).send({ message: 'No se han agregado equipos' });

        if (equipoEncontrado.length % 2 == 0) {
            MaximaJornada = equipoEncontrado.length - 1
        } else {
            MaximaJornada = equipoEncontrado.length
        }
        Jornadas.find({ Liga: Ligas }, (err, ligas) => {
            if (ligas.length >= MaximaJornada) return res.status(500).send({ message: 'Error solo pueden existir: ' + MaximaJornada + ' Numero de Jornadas' });

            Ligas.findById({ _id: Ligas }, (err, ligaEncontradas) => {
                
                if (!ligaEncontradas) return res.status(500).send({ message: 'Liga no encontrada' });

                    Usuarios.findOne({ _id: ligaEncontradas.Creador }, (err, usuarioEncontrado) => {

                    console.log(usuarioEncontrado)
                    Creador = usuarioEncontrado._id;

                if (req.user.rol == 'Usuario' && usuarioEncontrado._id != req.user.sub) return res.status(500).send({ message: 'No posee los permisos para agregar a esta liga' });

                if (parametros.nombreJornada) {

                    joranadasModel.nombreJornada = parametros.nombreJornada;
                    joranadasModel.Liga = Ligas;
                    joranadasModel.Creador = Creador;

                    Jornadas.findOne({ nombreJornada: parametros.nombreJornada, Liga: Ligas }, (err, jornadaEncontrada) => {
                            if (jornadaEncontrada == null) { joranadasModel.save((err, jornadaGuardada) => {
                                    if (err) return res.status(500).send({ message: 'No se pudo Guardar' });
                                    if (!jornadaGuardada) return res.status(404).send({ message: 'Equipos no encontrados' });

                                    return res.status(200).send({ jornada: jornadaGuardada });
                                })
                            } else {
                                return res.status(500).send({ message: 'La jornada ya esa en existencia' });

                            }
                        })
                    } else {
                        return res.status(500).send({ message: 'Complete los campos!' });

                    }
                })
            })
        })
    })
}

function VerJornadas(req, res) {
    var ligas = req.param.ligas;
    var idJornada;
    var user;

    if (req.user.rol == 'Usuario') {
        Jornadas.find({ Liga: ligas, UsuarioCreador: req.user.sub }, (err, jornadasEncontradas) => {
            if (err) return res.status(500).send({ message: 'Esta liga no te pertenece' })
            if (jornadasEncontradas == '') return res.status(500).send({ message: 'Esta liga no te pertenece' })

            return res.status(200).send({ jornadas: jornadasEncontradas })
        })
    } else if (req.user.rol == 'ADMIN') {
        Jornadas.find({ Liga: ligas, UsuarioCreador: req.user.sub }, (err, jornadasEncontradas) => {
            if (!jornadasEncontradas) return res.status(500).send({ message: 'No se encontro las jornadas' })

            return res.status(200).send({ jornadas: jornadasEncontradas })
        })
    }

}


function editarJornada(req, res) {
    var parametros = req.body;
    var idJornada = req.params.idJornada;
    if (req.user.rol == 'ADMIN') {
        Liga = req.params.Liga
        UsuarioCreador = req.params.idCreador
    } else if (req.user.rol == 'Usuario') {
        UsuarioCreador = req.user.sub
        Liga = req.params.Liga
    }


    Jornadas.findById({ _id: idJornada }, (err, ligaEncontradas) => {
        if (!ligaEncontradas) return res.status(500).send({ message: 'No se encontro la jornada' });

        Ligas.findById({ _id: ligaEncontradas.Liga }, (err, ligaFind) => {
            if (!ligaFind) return res.status(500).send({ message: 'No se encontro la liga' });

            Usuarios.findById({ _id: ligaEncontradas.UsuarioCreador }, (err, usuarioEncontrado) => {
                if (!usuarioEncontrado) return res.status(500).send({ message: 'No se encontro el usuario' })

                if (req.user.rol == 'Usuario' && usuarioEncontrado._id != req.user.sub) return res.status(500).send({ message: 'esta liga no te pertenece' });

                if (parametros.nombreJornada) {
                    Jornadas.findOne({ nombreJornada: parametros.nombreJornada, Liga: Liga }, (err, jornadaEncontrada) => {

                        if (jornadaEncontrada == null) {
                            Jornadas.findByIdAndUpdate({ _id: idJornada }, parametros, { new: true }, (err, jornadaEditada) => {
                                if (err) return res.status(500).send({ message: 'Error en la peticion' });
                                if (!jornadaEditada) return res.status(404).send({ message: 'No se pudo editar jornadas' });

                                return res.status(200).send({ jornada: jornadaEditada });
                            })
                        } else {
                            return res.status(500).send({ message: 'Esta jornada con este nombre ya existe' })
                        }
                    })
                } else {
                    return res.status(500).send({ message: 'llene los campos' })
                }

            })
        })
    })
}


function eliminarJornada(req, res) {
    var idJornada = req.params.idJornada;
    if (req.user.rol == 'ADMIN') {
        idLiga = req.params.idLiga
        UsuarioCreador = req.params.idCreador
    } else if (req.user.rol == 'Usuario') {
        UsuarioCreador = req.user.sub
        Liga = req.params.idLiga
    }

    Jornadas.findById({ _id: idJornada }, (err, ligaEncontradas) => {
        if (!ligaEncontradas) return res.status(500).send({ message: 'No se encontro la jornada' });

        Ligas.findById({ _id: ligaEncontradas.Liga }, (err, ligaFind) => {
            if (!ligaFind) return res.status(500).send({ message: 'No se encontro la liga' });

            Usuarios.findById({ _id: ligaEncontradas.UsuarioCreador }, (err, usuarioEncontrado) => {
                if (!usuarioEncontrado) return res.status(500).send({ message: 'No se encontro el usuario' })

                if (req.user.rol == 'Usuario' && usuarioEncontrado._id != req.user.sub) return res.status(500).send({ message: 'esta liga no te pertenece' });

                Jornadas.findByIdAndDelete({ _id: idJornada }, { new: true }, (err, jornadaEliminada) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion' });
                    if (!jornadaEliminada) return res.status(404).send({ message: 'No se pudo eliminar jornadas' });

                    return res.status(200).send({ jornada: jornadaEliminada });
                })

            })
        })
    })
}

module.exports = {
    agregarJornada,
    editarJornada,
    eliminarJornada,
    VerJornadas

}