
import bodyParser from 'body-parser';
import cors from 'cors';

import mongoose from 'mongoose';
import AppRouter from './routes/routing';
import ServerExpress from './classes/server';

let server = ServerExpress.instance;

// parse application/x-www-form-urlencoded
server.app.use( bodyParser.urlencoded( {extended: true} ) );

// parse application/json
server.app.use( bodyParser.json() );

// config cors
server.app.use( cors( { origin: true, credentials: true } ) );

// ruting de mis apiRest
server.app.use( AppRouter );

mongoose.connect('mongodb://localhost:27017/ionic_mgt_db', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err: any) => {
    if (err) {
        throw err;
    }
    // let psw = bcrypt.hashSync('123456Cq', 10);
 
    console.log('Conectado a base de datos!!');
});


server.onStart( (err: any) => {

    if (err) {
        throw new Error( 'Error al iniciar servidor de express' );
    }

    console.log('Servidor corriendo en puerto:s ', server.port);

});