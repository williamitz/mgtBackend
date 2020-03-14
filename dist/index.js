"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var mongoose_1 = __importDefault(require("mongoose"));
var routing_1 = __importDefault(require("./routes/routing"));
var server_1 = __importDefault(require("./classes/server"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var enviroment_1 = require("./global/enviroment");
var server = server_1.default.instance;
// parse application/x-www-form-urlencoded
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
// parse application/json
server.app.use(body_parser_1.default.json());
// config cors
server.app.use(cors_1.default({ origin: true, credentials: true }));
// config file-upload
server.app.use(express_fileupload_1.default());
// ruting de mis apiRest
server.app.use(routing_1.default);
mongoose_1.default.connect(enviroment_1.MONGODB_CONNECT, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        throw err;
    }
    // let psw = bcrypt.hashSync('123456Cq', 10);
    console.log('Conectado a base de datos!!');
});
server.onStart(function (err) {
    if (err) {
        throw new Error('Error al iniciar servidor de express');
    }
    console.log('Servidor corriendo en puerto:s ', server.port);
});
