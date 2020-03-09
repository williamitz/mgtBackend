"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var request_ip_1 = __importDefault(require("request-ip"));
var user_model_1 = require("../models/user.model");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var enviroment_1 = require("../global/enviroment");
var UserRoutes = express_1.Router();
UserRoutes.post('/singIn', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var body, resVerify, newUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                return [4 /*yield*/, verifyUser(body.nameUser)];
            case 1:
                resVerify = _a.sent();
                if (!resVerify.ok) {
                    return [2 /*return*/, res.status(400).json({
                            ok: false,
                            error: resVerify.error
                        })];
                }
                if (resVerify.ok && resVerify.showError !== 0) {
                    return [2 /*return*/, res.json({
                            ok: true,
                            error: {
                                message: resVerify.message
                            },
                            showError: resVerify.showError
                        })];
                }
                newUser = new user_model_1.User({
                    name: body.name,
                    surname: body.surname,
                    nameComplete: body.surname + ", " + body.name,
                    nameUser: body.nameUser,
                    passwordUser: bcrypt_1.default.hashSync(body.passwordUser, 10),
                    registered: {
                        date: Date.now,
                        ip: request_ip_1.default.getClientIp(req)
                    }
                });
                newUser.save(function (err, userDB) {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            error: err
                        });
                    }
                    res.json({
                        ok: true,
                        data: userDB,
                        showError: resVerify.showError
                    });
                });
                return [2 /*return*/];
        }
    });
}); });
UserRoutes.post('/login', function (req, res) {
    var body = req.body;
    user_model_1.User.findOne({ nameUser: body.nameUser }, [], function (err, userDB) { return __awaiter(_this, void 0, void 0, function () {
        var showError, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (err) {
                        return [2 /*return*/, res.status(400).json({
                                ok: false,
                                error: err
                            })];
                    }
                    showError = 0;
                    if (!userDB) {
                        return [2 /*return*/, res.json({ ok: true, showError: 1 })];
                    }
                    if (!userDB.statusRegister) {
                        return [2 /*return*/, res.json({ ok: true, showError: 2 })];
                    }
                    if (!bcrypt_1.default.compareSync(body.passwordUser, userDB.passwordUser)) {
                        return [2 /*return*/, res.json({ ok: true, showError: 4 })];
                    }
                    userDB.passwordUser = null;
                    console.log('user db', userDB);
                    return [4 /*yield*/, jsonwebtoken_1.default.sign({ userDB: userDB }, enviroment_1.SEED_KEY, { expiresIn: '1d' })];
                case 1:
                    token = _a.sent();
                    console.log(token);
                    res.json({
                        ok: true,
                        showError: showError,
                        data: userDB,
                        token: token
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
function verifyUser(nameUser) {
    return new Promise(function (resolve) {
        user_model_1.User.findOne({ nameUser: nameUser }, ['statusRegister'], function (err, userDB) {
            if (err) {
                resolve({ ok: false, error: err, message: 'Error interno del servidor, al validar usuario' });
            }
            var showError = 0;
            if (userDB) {
                showError += 1;
                if (!userDB.statusRegister) {
                    showError += 2;
                }
            }
            resolve({ ok: true, message: '', showError: showError });
        });
    });
}
exports.default = UserRoutes;
