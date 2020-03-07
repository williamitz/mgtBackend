"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __importDefault(require("./user"));
var UserConnection = /** @class */ (function () {
    function UserConnection() {
        this.UserList = [];
    }
    UserConnection.prototype.onAddUser = function (idSocket) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.UserList.push(new user_1.default(idSocket));
            resolve({ ok: true, message: 'Usuario creado con éxito :D' });
        });
    };
    UserConnection.prototype.onUpdateUser = function (idSocket, id, userName, nameComplete) {
        var _this = this;
        return new Promise(function (resolve) {
            var index = _this.UserList.findIndex(function (user) { return user.idSocket === idSocket; });
            if (index >= 0) {
                _this.UserList[index].id = id;
                _this.UserList[index].idSocket = idSocket;
                _this.UserList[index].userName = userName;
                _this.UserList[index].nameComplete = nameComplete;
                console.log(_this.UserList);
                resolve({ ok: true, message: 'Usuario configurado con éxito :D' });
            }
            else {
                resolve({ ok: false, message: 'No se encontró usuario a configurar :(' });
            }
        });
    };
    UserConnection.prototype.onDeleteUser = function (idSocket) {
        var _this = this;
        return new Promise(function (resolve) {
            var user = _this.UserList.find(function (user) { return user.idSocket === idSocket; });
            if (user) {
                _this.UserList = _this.UserList.filter(function (user) { return user.idSocket != idSocket; });
                resolve({ ok: true, message: 'Usuario eliminado con éxito :(' });
            }
            else {
                resolve({ ok: false, message: 'No se encontró usuario a eliminar' });
            }
        });
    };
    return UserConnection;
}());
exports.default = UserConnection;
