import  express from 'express';
import http from 'http';
import socketIO from 'socket.io';

import { SERVER_PORT } from '../global/enviroment';
import * as sockets from '../sockets/socketApp';

export default class ServerExpress {

    public static _instamce: ServerExpress;
    
    public app: express.Application;
    public port: number;
    public httpServer: http.Server;
    private io: socketIO.Server;

    constructor() {
        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );

        this.listenSockets();
    }

    onStart( callback: Function ) {
        this.httpServer.listen( this.port, callback() );
    }

    public static get instance() {
        return this._instamce || ( this._instamce = new this() );
    }

    private listenSockets() {
        this.io.on( 'connection', ( client: socketIO.Socket ) => {
            
            sockets.onConnectClient( client );

            sockets.onDisconnectClient( client );

            sockets.onSingInClient( client, this.io );
            
        });
    }


}

