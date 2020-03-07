export default class UserModel {
    id: number;
    idSocket: string;
    userName: string;
    nameComplete: string;

    constructor( idSocket: string ) {
        this.id = 0;
        this.idSocket = idSocket;
        this.userName = '';
        this.nameComplete = 'nuevo usuario - sin nombre';
    }
}