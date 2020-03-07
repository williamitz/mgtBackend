"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserModel = /** @class */ (function () {
    function UserModel(idSocket) {
        this.id = 0;
        this.idSocket = idSocket;
        this.userName = '';
        this.nameComplete = 'nuevo usuario - sin nombre';
    }
    return UserModel;
}());
exports.default = UserModel;
