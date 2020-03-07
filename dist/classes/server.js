"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var enviroment_1 = require("../global/enviroment");
var sockets = __importStar(require("../sockets/socketApp"));
var ServerExpress = /** @class */ (function () {
    function ServerExpress() {
        this.app = express_1.default();
        this.port = enviroment_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
        this.io = socket_io_1.default(this.httpServer);
        this.listenSockets();
    }
    ServerExpress.prototype.onStart = function (callback) {
        this.httpServer.listen(this.port, callback());
    };
    Object.defineProperty(ServerExpress, "instance", {
        get: function () {
            return this._instamce || (this._instamce = new this());
        },
        enumerable: true,
        configurable: true
    });
    ServerExpress.prototype.listenSockets = function () {
        var _this = this;
        this.io.on('connection', function (client) {
            sockets.onConnectClient(client);
            sockets.onDisconnectClient(client);
            sockets.onSingInClient(client, _this.io);
        });
    };
    return ServerExpress;
}());
exports.default = ServerExpress;
