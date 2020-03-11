"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var enviroment_1 = require("../global/enviroment");
exports.verifyToken = function (req, res, next) {
    var token = req.get('Authorization') || '';
    jsonwebtoken_1.default.verify(token, enviroment_1.SEED_KEY, function (error, decoded) {
        if (error) {
            return res.status(401).json({
                ok: false,
                error: error
            });
        }
        req.user = decoded.userDB;
        next();
    });
};
