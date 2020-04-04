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
var authorization_md_1 = require("../middlewares/authorization.md");
var comunity_model_1 = require("../models/comunity.model");
var user_model_1 = require("../models/user.model");
var mongoose_1 = __importDefault(require("mongoose"));
var ComunityRoute = express_1.Router();
// seguir a una persona
ComunityRoute.post('/Comunity/AddFollowed', [authorization_md_1.verifyToken], function (req, res) {
    var idUser = req.user._id;
    var body = req.body;
    var idFollowed = body.idFollowed || '';
    var arrWhere = {
        user: mongoose_1.default.Types.ObjectId(idUser),
        statusRegister: true
    };
    comunity_model_1.Comunity.findOne(arrWhere, [], function (error, comunityDB) {
        if (error) {
            return res.status(400).json({
                ok: false,
                error: error
            });
        }
        var newFollowed = { user: mongoose_1.default.Types.ObjectId(idFollowed), dateFollow: new Date(), locked: false };
        comunityDB.followed.push(newFollowed);
        comunityDB.save(function (error, comunityUpdate) { return __awaiter(_this, void 0, void 0, function () {
            var resFollowerMe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (error) {
                            return [2 /*return*/, res.status(400).json({
                                    ok: false,
                                    error: error
                                })];
                        }
                        return [4 /*yield*/, addFollowerFollowed(idFollowed, idUser)];
                    case 1:
                        resFollowerMe = _a.sent();
                        if (!resFollowerMe.ok) {
                            return [2 /*return*/, res.status(400).json({
                                    ok: false,
                                    error: resFollowerMe.error
                                })];
                        }
                        res.json({
                            ok: true,
                            data: resFollowerMe.data
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
ComunityRoute.post('/Comunity/RemoveFollowed', [authorization_md_1.verifyToken], function (req, res) {
    var idUser = req.user._id;
    var body = req.body;
    var idFollowed = body.idFollowed || '';
    var arrWhere = {
        user: mongoose_1.default.Types.ObjectId(idUser),
        statusRegister: true
    };
    comunity_model_1.Comunity.findOne(arrWhere, [], function (error, comunityDB) {
        if (error) {
            return res.status(400).json({
                ok: false,
                error: error
            });
        }
        var indexRemove = -1;
        comunityDB.followed.forEach(function (followed) {
            indexRemove++;
            if (followed.user.toHexString() === idFollowed) {
                console.log('encontrado !! remove');
                return;
            }
        });
        if (indexRemove >= 0) {
            comunityDB.followed[indexRemove] = null;
            comunityDB.followed = comunityDB.followed.filter(function (user) { return user !== null; });
        }
        console.log('mi comunidad editada!', comunityDB.followed);
        comunityDB.save(function (error, comunityUpdate) { return __awaiter(_this, void 0, void 0, function () {
            var resFollowerMe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (error) {
                            return [2 /*return*/, res.status(400).json({
                                    ok: false,
                                    error: error
                                })];
                        }
                        return [4 /*yield*/, removeFollowerFollowed(idFollowed, idUser)];
                    case 1:
                        resFollowerMe = _a.sent();
                        if (!resFollowerMe.ok) {
                            return [2 /*return*/, res.status(400).json({
                                    ok: false,
                                    error: resFollowerMe.error
                                })];
                        }
                        res.json({
                            ok: true,
                            data: resFollowerMe.data
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
// agregarme como seguidor de la persona seguida
function addFollowerFollowed(idFollowed, idUser) {
    return new Promise(function (resolve) {
        console.log('id', idFollowed);
        var arrWhere = { user: mongoose_1.default.Types.ObjectId(idFollowed) };
        comunity_model_1.Comunity.findOne(arrWhere, [], function (error, comunityDB) {
            if (error) {
                resolve({ ok: false, error: error });
            }
            if (!comunityDB) {
                resolve({ ok: false, error: { message: 'No se encontró comunidad del usuario a seguir' } });
            }
            console.log('comunidad seguido', comunityDB);
            var arrFollower = {
                user: new mongoose_1.default.Types.ObjectId(idUser),
                dateFollow: new Date(),
                locked: false
            };
            comunityDB.followers.push(arrFollower);
            comunityDB.save(function (error, comunityUpdate) {
                console.log('update', comunityUpdate);
                if (error) {
                    resolve({ ok: false, message: 'Error al agregarme como seguidor' });
                }
                resolve({ ok: true, data: comunityUpdate });
            });
        });
    });
}
// quitarme como seguidor de la persona seguida
function removeFollowerFollowed(idFollowed, idUser) {
    return new Promise(function (resolve) {
        var arrWhere = {
            user: mongoose_1.default.Types.ObjectId(idFollowed),
            statusRegister: true
        };
        comunity_model_1.Comunity.findOne(arrWhere, [], function (error, comunityDB) {
            if (error) {
                resolve({ ok: false, error: error });
            }
            if (!comunityDB) {
                resolve({ ok: false, error: { message: 'No se encontró comunidad del usuario a seguir' } });
            }
            var indexRemove = -1;
            comunityDB.followers.forEach(function (follower) {
                indexRemove++;
                if (follower.user.toHexString() === idUser) {
                    return;
                }
            });
            if (indexRemove >= 0) {
                comunityDB.followers[indexRemove] = null;
                comunityDB.followers = comunityDB.followers.filter(function (user) { return user !== null; });
            }
            comunityDB.save(function (error, comunityUpdate) {
                if (error) {
                    resolve({ ok: false, error: error, message: 'Error al eliminarme como seguidor' });
                }
                resolve({ ok: true, data: comunityUpdate });
            });
        });
    });
}
ComunityRoute.get('/Comunity/newFollow', [authorization_md_1.verifyToken], function (req, res) {
    var idUser = req.user._id;
    comunity_model_1.Comunity.aggregate([{ $match: { user: mongoose_1.default.Types.ObjectId(idUser) } }])
        // .match( { user: idUser } )
        .project({ 'followed': 1 })
        .unwind('$followed')
        .exec(function (error, result) { return __awaiter(_this, void 0, void 0, function () {
        var arrFollowed, users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (error) {
                        return [2 /*return*/, res.status(400).json({
                                ok: false,
                                error: error
                            })];
                    }
                    arrFollowed = [];
                    result.forEach(function (element) {
                        arrFollowed.push(element.followed.user);
                    });
                    return [4 /*yield*/, user_model_1.User.find({}, ['nameComplete', 'nameUser', 'imgUser'])
                            .where('_id')
                            .ne(idUser)
                            .nin(arrFollowed)
                            .sort({ registered: -1 })];
                case 1:
                    users = _a.sent();
                    res.json({
                        ok: true,
                        data: users
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
exports.default = ComunityRoute;
