const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PartidosSchema = Schema({ 
    equipo1: { type: Schema.Types.ObjectId, ref: 'Equipos'},
    golesaEquipo1: String,
    equipo2: { type: Schema.Types.ObjectId, ref: 'Equipos'},
    golesaEquipo2: String,
    Liga: { type: Schema.Types.ObjectId, ref: 'Ligas'},
    Jornada: { type: Schema.Types.ObjectId, ref: 'Jornadas'},
});

module.exports = mongoose.model('Partidos', PartidosSchema);