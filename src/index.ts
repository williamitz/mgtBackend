
import bodyParser from 'body-parser';
import cors from 'cors';
import router from "./routes/routing";
import ServerExpress from './classes/server';

let server = ServerExpress.instance;


// parse application/x-www-form-urlencoded
server.app.use( bodyParser.urlencoded( {extended: true} ) );

// parse application/json
server.app.use( bodyParser.json() );

// config cors
server.app.use( cors( { origin: true, credentials: true } ) );

// ruting de mis apiRest
server.app.use( router );


server.onStart( (err: any) => {

    if (err) {
        throw new Error( 'Error al iniciar servidor de express' );
    }

    console.log('Servidor corriendo en puerto: ', server.port);

});