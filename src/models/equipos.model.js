const mongoose = require('mongoose');
var Schema = mongoose.Schema;



var EquiposSchema = Schema({ 
    nombreEquipo: String,
    golaFavor: Number,
    golenContra: Number,
    difGoles: Number,
    cantidadPartidos: Number,
    puntos: Number,
    LigaId: { type: Schema.Types.ObjectId, ref: 'Ligas'},
    Creador: { type: Schema.Types.ObjectId, ref: 'Usuarios'}
});



module.exports = mongoose.model('Equipos', EquiposSchema);