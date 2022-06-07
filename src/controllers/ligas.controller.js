const Ligas = require('../models/ligas.model');



function agregarLiga(req, res) {
    var parametros = req.body;
    var ligaModel = new Ligas();
    var Creador;

    if (parametros.LigaNombres) {
        ligaModel.LigaNombres = parametros.LigaNombres;
        if (req.user.rol == 'Usuario') {
            Creador = req.user.sub;
            ligaModel.Creador = req.user.sub;
        } else if (req.user.rol == 'ADMIN') {
            if (req.params.Creador == null) {
                return res.status(500).send({ message: 'El id no se ha enviado' })
            } else {
                Creador = req.params.Creador
                ligaModel.Creador = Creador;
            }

        }


        Ligas.find({ LigaNombres: parametros.LigaNombres, Creador: Creador }, (err, ligaEncontrada) => {
            if (ligaEncontrada == 0) {
                ligaModel.save((err, ligaGuardada) => {
                    if (err) return res.status(500).send({ message: 'No se pudo guardar ligaGuardada.' });

                    if (!ligaGuardada) return res.status(500).send({ message: 'No se pudo guardar ligaGuardada.' });

                    return res.status(200).send({ Liga: ligaGuardada })
                });
            } else {
                return res.status(500).send({ message: 'Este nombre ya se encuentra utilizado' })
            }
        });
    } else {
        return res.status(500).send({ message: 'Faltan campos por completar!' })
    }
}



function editarLiga(req, res) {
    var parametros = req.body;
    var liga = req.params.idLiga;


    if (parametros.LigaNombres) {
        if (req.user.rol == 'Usuario') {
            Ligas.findOne({ LigaNombres: parametros.LigaNombres, Creador: req.user.sub }, (err, ligaEncotradas) => {
                if (ligaEncotradas != null && parametros.LigaNombres != ligaEncotradas.LigaNombres) {return res.status(500).send({ message: 'Este nombre ya esta siendo ocupado' });
                } else {
                    Ligas.findByIdAndUpdate({ _id: liga, Creador: req.user.sub }, parametros, { new: true }, (err, ligaEditada) => {
                        if (err) return res.status(500).send({ message: 'No se pudo editar la liga' });

                        if (!ligaEditada) return res.status(500).send({ message: 'Los datos no se actualizaron' });

                        return res.status(200).send({ ligaEditada: ligaEditada })
                    })

                }
            });
        } else if (req.user.rol == 'ADMIN') {
            Ligas.findOne({ LigaNombres: parametros.LigaNombres }, (err, ligaEncotradas) => {
                if (ligaEncotradas == null && liga == ligaEncotradas._id) {Ligas.findByIdAndUpdate({ _id: liga }, parametros, { new: true }, (err, ligaEditada) => {
                        if (err) return res.status(500).send({ message: 'Error al editar liga' });

                        if (!ligaEditada) return res.status(500).send({ message: 'Los datos no se actualizaron' });

                        return res.status(200).send({ ligaEditada: ligaEditada })
                    })
                } else {
                    return res.status(500).send({ message: 'Este nombre ya esta siendo ocupado' });
                }
            });
        }


    } else {
        return res.status(500).send({ message: 'Faltan campos por completar!' });
    }
}



function eliminarLiga(req, res) {
    var liga = req.params.idLiga;
    if (req.user.rol == 'Usuario') {
        Ligas.findByIdAndDelete({ _id: liga, Creador: req.user.sub }, (err, ligaEliminada) => {
            if (err) return res.status(500).send({ message: 'No se pudo eliminar' });

            if (!ligaEliminada) return res.status(500).send({ message: 'La liga no pudo ser eliminada' });

            return res.status(200).send({ ligaEliminada: ligaEliminada })
        })
    } else if (req.user.rol == 'ADMIN') {
        Ligas.findByIdAndDelete({ _id: liga }, (err, ligaEliminada) => {
            if (err) return res.status(500).send({ message: 'No pudimos eliminar esta liga' });

            if (!ligaEliminada) return res.status(500).send({ message: 'No se pudo eliminar esta liga' });

            return res.status(200).send({ ligaEliminada: ligaEliminada })
        })
    }
}



function verLigas(req, res) {
    if (req.user.rol == 'Usuario') return res.status(500).send({ message: 'No tienes permiso para ver ligas' });


    Ligas.find((err, listaLigas) => {
        if (err) return res.status(500).send({ message: 'No se pudo listar' });

        if (!listaLigas) return res.status(500).send({ message: 'No se encontraron ligas' });

        return res.status(200).send({ Ligas: listaLigas });
    });
}



function verLigasId(req, res) {
    if (req.user.rol == 'Usuario') {
        Ligas.find({ Creador: req.user.sub }, (err, listaLigasId) => {
            if (err) return res.status(500).send({ message: 'No se pudo listar' });
            
            if (!listaLigasId) return res.status(500).send({ message: 'No se encontraron ligas' });

            return res.status(200).send({ Ligas: listaLigasId });
        });
    } else if (req.user.rol == 'ADMIN') {
        Ligas.findById({ _id: req.params.idLiga }, (err, listaLigasId) => {
            if (err) return res.status(500).send({ message: 'No se pudo listar' });
            if (!listaLigasId) return res.status(500).send({ message: 'No se encontraron ligas' });

            return res.status(200).send({ Ligas: listaLigasId });
        });
    }
}



module.exports = {
    agregarLiga,
    editarLiga,
    eliminarLiga,
    verLigas,
    verLigasId
    
}