import { Socket } from 'socket.io';
import { PayloadSingIn } from '../interfaces/entitys.interface';
import UserConnection from '../classes/user-connection';

let UserConnexions = new UserConnection();

export const onConnectClient = async ( client: Socket ) => {
    let res = await UserConnexions.onAddUser( client.id );
    if (res.ok) {
        console.log(res.message);
    } else {
        console.warn( res.message );
    }
};

export const onDisconnectClient = ( client: Socket ) => {
    client.on('disconnect', async () => {

        let res = await UserConnexions.onDeleteUser( client.id );
        if (res.ok) {
            
            console.log( res.message );
        } else {
            console.log( res.message );

        }
    });
};

export const onSingInClient = ( client: Socket, io: SocketIO.Server ) => {
    client.on('sigin-client', async ( payload: any ) => {

        // console.log('payload ', payload);

        let res = await UserConnexions.onUpdateUser( client.id, payload.id, payload.userName, payload.nameComplete );

        if (res.ok) {
            console.log(res.message);
            io.in( client.id ).emit('success-singing-client', ( { ok: true, message: 'Cliente configurado' } ) );
        } else {
            console.log(res.message);
        }
    });
};

