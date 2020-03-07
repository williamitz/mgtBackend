import { ResponsePromise } from "../interfaces/entitys.interface";
import UserModel from "./user";

export default class UserConnection {

    private UserList: UserModel[];

    constructor() {
        this.UserList = [];
    }

    onAddUser( idSocket: string ): Promise< ResponsePromise > {
        return new Promise( (resolve) => {
            this.UserList.push( new UserModel( idSocket )  );

            resolve( { ok: true, message: 'Usuario creado con éxito :D' } );
        });
    }

    onUpdateUser( idSocket: string, id: number, userName: string, nameComplete: string  ): Promise< ResponsePromise >  {
        return new Promise( (resolve) => {
            let index = this.UserList.findIndex( user => user.idSocket === idSocket );
            if (index >= 0) {
                
                this.UserList[ index ].id = id;
                this.UserList[ index ].idSocket = idSocket;
                this.UserList[ index ].userName = userName;
                this.UserList[ index ].nameComplete = nameComplete;

                console.log(this.UserList);

                resolve( { ok: true, message: 'Usuario configurado con éxito :D' } );
            } else {
                resolve( { ok: false, message: 'No se encontró usuario a configurar :(' } );
            }
            
        });
    }

    onDeleteUser( idSocket: string ): Promise< ResponsePromise >  {
        return new Promise( (resolve) => {
            let user = this.UserList.find( user => user.idSocket === idSocket );
            if ( user ) {
                this.UserList = this.UserList.filter( user => user.idSocket != idSocket );
                resolve( { ok: true, message: 'Usuario eliminado con éxito :(' } );
            } else {
                resolve( { ok: false, message: 'No se encontró usuario a eliminar' } );
            }
        });
    }
}
