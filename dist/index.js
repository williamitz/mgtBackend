"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var routing_1 = __importDefault(require("./routes/routing"));
var server_1 = __importDefault(require("./classes/server"));
var server = server_1.default.instance;
// parse application/x-www-form-urlencoded
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
// parse application/json
server.app.use(body_parser_1.default.json());
// config cors
server.app.use(cors_1.default({ origin: true, credentials: true }));
// ruting de mis apiRest
server.app.use(routing_1.default);
server.onStart(function (err) {
    if (err) {
        throw new Error('Error al iniciar servidor de express');
    }
    console.log('Servidor corriendo en puerto: ', server.port);
});
