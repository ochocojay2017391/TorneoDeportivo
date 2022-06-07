const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LigasSchema = Schema({ 
    LigaNombres: String,
    Creador: { type: Schema.Types.ObjectId, ref: 'Usuarios'}
});

module.exports = mongoose.model('Ligas', LigasSchema);