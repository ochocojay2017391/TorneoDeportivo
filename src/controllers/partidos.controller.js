const Partidos = require('../models/partidos.model');
const Equipos = require('../models/equipos.model');
const ligasModel = require('../models/ligas.model');
const Jornadas = require('../models/jornadas.model');
const Ligas = require('../models/ligas.model');


function agregarPartido(req, res) {
    var parametros = req.body;
    var idJornada = req.params.idJornada;
    var partidosMaximos;
    var partidosModel = new Partidos();

    if (parametros.equipo1 && parametros.equipo2) {

        Jornadas.findById({ _id: idJornada }, (err, jornadaEncontrada) => {
            if (!jornadaEncontrada) return res.status(500).send({ message: 'No se encontro la jornada seleccionada' });

            console.log(jornadaEncontrada.Liga)

            Equipos.findById({ _id: parametros.equipo1, UsuarioCreador: jornadaEncontrada.UsuarioCreador }, (err, equipo1Encontrado) => {

                if (!equipo1Encontrado) return res.status(500).send({ message: 'No se encontro el equipo 1 seleccionado' });

                Equipos.findById({ _id: parametros.equipo2, UsuarioCreador: jornadaEncontrada.UsuarioCreador }, (err, equipo2Encontrado) => {

                    if (!equipo2Encontrado) return res.status(500).send({ message: 'No se encontro el equipo 2 seleccionado' });

                    Ligas.findById({ _id: equipo2Encontrado.Liga }, (err, ligaEncontradas) => {
                        if (!ligaEncontradas) return res.status(500).send({ message: 'No se encontro la liga seleccionada' });


                        if (req.user.rol == 'Usuario' && req.user.sub != ligaEncontradas.UsuarioCreador) return res.status(500).send({ message: 'No puede agregar partidos no te pertenece a esta liga' });

                        Equipos.find({ Liga: ligaEncontradas._id }, (err, equiposLigaEncontrados) => {
                            if (err) return res.status(500).send({ message: 'Esta liga no tiene equipos aun' });

                            if (equiposLigaEncontrados.length % 2 == 0) {
                                partidosMaximos = (equiposLigaEncontrados.length / 2)
                                console.log(ligaEncontradas_id + 'a')
                            } else {
                                partidosMaximos = (equiposLigaEncontrados.length - 1) / 2
                                console.log(partidosMaximos)
                            }

                            Partidos.find({ Liga: ligaEncontradas._id }, (err, partidosLigaEncontrados) => {
                                if (!partidosLigaEncontrados) return res.status(500).send({ message: 'No se encontraron partidos en esta liga' });

                                if (partidosLigaEncontrados.length >= partidosMaximos) return res.status(500).send({ message: 'Ha excedido los partidos por liga, hay un maximo de ' + partidosMaximos + ' por jornada' });

                                Partidos.findOne({ equipo1: parametros.equipo1, Jornada: idJornada }, (err, equipo1Find) => {
                                    if (!equipo1Find) {
                                        Partidos.findOne({ equipo2: parametros.equipo2, Jornada: idJornada }, (err, equipo2Find) => {
                                            if (!equipo2Find) {
                                                partidosModel.equipo1 = parametros.equipo1;
                                                partidosModel.golesEquipo1 = 0
                                                partidosModel.equipo2 = parametros.equipo2;
                                                partidosModel.golesEquipo2 = 0;
                                                partidosModel.Liga = jornadaEncontrada.Liga;
                                                partidosModel.Jornada = idJornada

                                                console.log(ligaEncontradas.Liga)

                                                partidosModel.save((err, partidoGuardado) => {
                                                    if (err) return res.status(500).send({ message: 'Ocurrio un error en la peticion' });
                                                    if (!partidoGuardado) return res.status(500).send({ message: 'No se pudo guardar el partido' });

                                                    return res.status(200).send({ Partido: partidoGuardado })
                                                })
                                            } else {
                                                return res.status(500).send({ message: 'El equipo 2 ya jugo esta jornada' })
                                            }
                                        })
                                    } else {
                                        return res.status(500).send({ message: 'El equipo 1 ya jugo esta jornada' });
                                    }

                                })

                            })
                        })
                    })
                })
            })
        })


    } else {
        return res.status(500).send({ message: 'Llene los campos necesarios' });
    }
}

function editarPartiddo(req, res) {
    var parametros = req.body
    var idPart = req.params.idPartido
    var pts1;
    var pts2;
    if (parametros.equipo1 && parametros.equipo2) {
        return res.status(200).send({ message: 'No puedes modificar los equipos, solo  su marcador' })
    } else {
        Partidos.findById({ _id: idPart }, (err, partidoEncontrado) => {
            if (!partidoEncontrado) return res.status(500).send({ message: 'No se encontro el partido seleccionado' });

            console.log(partidoEncontrado)

            Ligas.findById({ _id: partidoEncontrado.Liga }, (err, ligaEncontrada) => {
                if (!ligaEncontrada) return res.status(500).send({ message: 'No se encontro la liga de este partido seleccionado' });

                if (req.user.role == 'Usuario' && ligaEncontrada.UsuarioCreador != req.user.sub) return res.status(500).send({ message: 'Esta liga no te pertenece' });

                Partidos.findByIdAndUpdate({ _id: idPart }, parametros, { new: true }, (err, marcadorActualizado) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion' });
                    if (!marcadorActualizado) return res.status(500).send({ message: 'No se puedo editar el marcador' });

                    if (marcadorActualizado.golesEquipo1 > marcadorActualizado.golesEquipo2) {
                        pts1 = 2
                        pts2 = 0
                    } else if (marcadorActualizado.golesEquipo1 < marcadorActualizado.golesEquipo2) {
                        pts1 = 0;
                        pts2 = 2;
                    } else if (marcadorActualizado.golesEquipo1 == marcadorActualizado.golesEquipo2) {
                        pts1 = 1;
                        pts2 = 1;
                    }
                    console.log(pts1, pts2);
                    editarDatosEquipo(pts1, marcadorActualizado.golesEquipo1, marcadorActualizado.golesEquipo2, marcadorActualizado.equipo1)
                    editarDatosEquipo(pts2, marcadorActualizado.golesEquipo2, marcadorActualizado.golesEquipo1, marcadorActualizado.equipo2)
                    return res.status(200).send({ Partido: marcadorActualizado })
                })
            })

        });
    }

}

function editarDatosEquipo(pts, golesFav, golesCon, idEquipo) {
    var diferenciaGoles;
    Equipos.findByIdAndUpdate({ _id: idEquipo }, { $inc: { golesFavor: golesFav, golesContra: golesCon, cantidadJugados: 1, pts: pts } }, { new: true }, (err, datosEquipoModificados) => {
        diferenciaGoles = Math.abs(datosEquipoModificados.golesFavor - datosEquipoModificados.golesContra)

        Equipos.findByIdAndUpdate({ _id: idEquipo }, { $inc: { diferenciaGoles: diferenciaGoles } }, (err, datoModificados) => {
            if (!datoModificados) return res.status(500).send({ message: 'No se pudo actualizar los datos' })
        })
    })
}

module.exports = {
    agregarPartido,
    editarPartiddo
}