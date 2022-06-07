const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var JornadasSchema = Schema({ 
    nombreJornada: String,
    LigaId: { type: Schema.Types.ObjectId, ref: 'Ligas'},
    Creador: { type: Schema.Types.ObjectId, ref: 'Usuarios'}
});

module.exports = mongoose.model('Jornadas', JornadasSchema);