const Ligas = require("../models/ligas.model");
const Usuarios = require("../models/usuario.model");
const Equipos = require("../models/equipos.model");


function verEquiposLiga(req, res) {
    var LigaId;
    var Creador;

    if (req.user.rol == "ADMIN") {

      LigaId = req.params.LigaId;
      Creador = req.params.Creador;

    } else if (req.user.rol == "Usuario") {

      Creador = req.user.sub;
      LigaId = req.params.LigaId;
    }
    Ligas.findById({ _id: LigaId }, (err, equipoEncontrado) => {
      if (req.user.rol == "Usuario" && equipoEncontrado.Creador != req.user.sub)
      return res.status(500).send({ message: "Usted no tiene acceso a editar este equipo" });
  
      Equipos.find({ Liga: LigaId }, (err, equipoEliminado) => {
        if (err) return res.status(500).send({ message: "No se pudo encontrar" });

        if (!equipoEliminado)
          return res.status(500).send({ message: "El equipo no se elimino" });
  
        return res.status(200).send({ Equipo: equipoEliminado });
      }).sort({
        pts: -1,
      });
    });
  }



  function agregarEquipo(req, res) {
    var parametros = req.body;
    var LigaId;
    var Creador;
    var equipoModel = new Equipos();
  
    if (req.user.rol == "ADMIN") {
      LigaId = req.params.LigaId;
      Creador = req.params.idCreador;
    } else if (req.user.rol == "Usuario") {
      Creador = req.user.sub;
      LigaId = req.params.LigaId;
    }
    Ligas.findById({ _id: LigaId }, (err, ligaEncontradas) => {
      if (!ligaEncontradas)
        return res.status(500).send({ message: "Esta liga no se encontro" });
  
      Usuarios.findOne({ _id: ligaEncontradas.Creador },(err, usuarioEncontrado) => {
          console.log(usuarioEncontrado);
          Creador = usuarioEncontrado._id;
  
          if (req.user.rol == "Usuario" && usuarioEncontrado._id != req.user.sub)
            return res.status(500).send({ message: "no tiene permiso para acceder a esta liga" });
  
          Equipos.find({ Liga: LigaId }, (err, ligaEncontradas) => {
            if (!ligaEncontradas)
              return res.status(500).send({ message: "Esta liga no existe" });
  
            if (ligaEncontradas.length >= 10)
            return res.status(500).send({ message: "Esta liga esta llena" });
  
            if (parametros.nombreEquipo) {
              equipoModel.nombreEquipo = parametros.nombreEquipo;
              equipoModel.golaFavor = 0;
              equipoModel.golenContra = 0;
              equipoModel.difGoles = 0;
              equipoModel.cantidadPartidos = 0;
              equipoModel.puntos = 0;
              equipoModel.LigaId = LigaId;
              equipoModel.Creador = Creador;
  
              Equipos.findOne({nombreEquipo: parametros.nombreEquipo, Liga: req.params.LigaId,},(err, nombreEncontrado) => {
                  if (nombreEncontrado == null) {
                    equipoModel.save((err, equipoGuardado) => {
                      if (err)
                        return res.status(500).send({ message: "Error en la peticion" });

                      if (!equipoGuardado)
                        return res.status(404).send({ message: "No fue posible encontrar equipos" });
  
                      return res.status(200).send({ equipo: equipoGuardado });
                    });
                  } else {
                    return res.status(500).send({message: "Este equipo ya se encuentra registrado",});
                  }
                }
              );
            } else {
              return res.status(500).send({ message: "Complete los campos!" });
            }
          });
        }
      );
    });
  }



  function editarEquipo(req, res) {
    var parametros = req.body;
    var LigaId;
    var Creador;
    var idEquipo = req.params.idEquipo;
  
    if (req.user.rol == "ADMIN") {
      LigaId = req.params.LigaId;
      Creador = req.params.idCreador;
    } else if (req.user.rol == "Usuario") {
      Creador = req.user.sub;
      LigaId = req.params.LigaId;
    }
    Equipos.findById({ _id: idEquipo }, (err, equipoEncontrado) => {
      if (req.user.rol == "Usuario" && equipoEncontrado.Creador != req.user.sub)
        return res.status(500).send({ message: "No posee los permisos para editar esta informacion" });
  
      Equipos.findOne(
        { nombreEquipo: parametros.nombreEquipo, Liga: LigaId },
        (err, equipoEncontrado) => {
          if (equipoEncontrado == null) {
            Equipos.findByIdAndUpdate({ _id: idEquipo, Creador: Creador },parametros,{ new: true },(err, equipoActualizado) => {
                if (err)
                  return res.status(500).send({ message: "Error al actualizar datos" });

                if (!equipoActualizado)
                  return res.status(500).send({ message: "No se pudieron guardar datos del equipo" });
                return res.status(200).send({ Equipo: equipoActualizado });

              }
            );
          } else {
            return res.status(500).send({ message: "Este equipo ya existe" });

          }
        }
      );
    });
  }



  function eliminarEquipo(req, res) {
    var LigaId;
    var Creador;
    var idEquipo = req.params.idEquipo;

    if (req.user.rol == "ADMIN") {
      LigaId = req.params.LigaId;
      Creador = req.params.idCreador;
    } else if (req.user.rol == "Usuario") {
      Creador = req.user.sub;
      LigaId = req.params.LigaId;
    }
    Equipos.findById({ _id: idEquipo }, (err, equipoEncontrado) => {
      if (req.user.rol == "Usuario" && equipoEncontrado.Creador != req.user.sub)
        return res.status(500).send({ message: "No posee los permisos para eliminar este equipo" });
  
      Equipos.findByIdAndDelete({ _id: idEquipo, Creador: Creador },{ new: true },(err, equipoEliminado) => {
          if (err) return res.status(500).send({ message: "error al eliminar" });
          if (!equipoEliminado)
            return res.status(500).send({ message: "No se puedieron eliminar los campos" });
  
          return res.status(200).send({ Equipo: equipoEliminado });
        }
      );
    });
  }

  

  module.exports = {
    agregarEquipo,
    editarEquipo,
    eliminarEquipo,
    verEquiposLiga
  };