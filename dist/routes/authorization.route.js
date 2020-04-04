"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var express_1 = require("express");
var enviroment_1 = require("../global/enviroment");
var AuthRoutes = express_1.Router();
AuthRoutes.post('/authentication', function (req, res) {
    var token = req.get('Authorization') || '';
    jsonwebtoken_1.default.verify(token, enviroment_1.SEED_KEY, function (error, decoded) {
        // console.log(token);
        if (error) {
            return res.json({
                ok: false,
                error: error,
                message: 'Credenciales inválidas'
            });
        }
        res.json({
            ok: true,
            message: 'Credenciales válidas'
        });
    });
});
exports.default = AuthRoutes;
