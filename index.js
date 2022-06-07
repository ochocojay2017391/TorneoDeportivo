const mongoose = require('mongoose');
const app = require('./app');
const UsuarioInicial =require('./src/controllers/usuario.controller')


mongoose.Promise = global.Promise;                                                               
mongoose.connect('mongodb://localhost:27017/TorneoDeportivo', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Se encuentra conectado a la base de datos de TorneoDeportivo.");

    app.listen(process.env.PORT || 3000, function() {
        console.log("Hola IN6BM, esta corriendo en el puerto 3000!")

        UsuarioInicial.AdminInicial();
    })

}).catch(error => console.log(error));




