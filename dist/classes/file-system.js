"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var uniqid_1 = __importDefault(require("uniqid"));
var FileSystem = /** @class */ (function () {
    function FileSystem() {
    }
    FileSystem.prototype.saveImageTemp = function (file, extensionFile, userId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var pathTemp = _this.newPathUser(userId);
            var nameFile = _this.generateUniqNameImg(extensionFile);
            file.mv(pathTemp + ("/" + nameFile), function (err) {
                if (err) {
                    return reject({ ok: false, error: err });
                }
                resolve({ ok: true, message: 'Se movio a carpeta temporal' });
            });
            // console.log('nombre img', nameFile);
        });
    };
    FileSystem.prototype.getPathImgUploaded = function (userId, img) {
        var pathImg = path_1.default.resolve(__dirname, '../uploads', userId, 'post', img);
        if (!fs_1.default.existsSync(pathImg)) {
            return path_1.default.resolve(__dirname, '../assets/img/no-image.jpg');
        }
        return pathImg;
    };
    FileSystem.prototype.generateUniqNameImg = function (extensionFile) {
        return uniqid_1.default() + ("." + extensionFile);
    };
    FileSystem.prototype.newPathUser = function (userId) {
        var pathUser = path_1.default.resolve(__dirname, '../uploads', userId);
        var pathTemp = pathUser + '/temp';
        if (!fs_1.default.existsSync(pathUser)) {
            // crear carpetas
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathTemp);
        }
        // console.log(pathUser);
        return pathTemp;
    };
    FileSystem.prototype.moveImgTempInPost = function (userId) {
        var pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        var pathPost = path_1.default.resolve(__dirname, '../uploads', userId, 'post');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        var filesTemp = this.getImgTemp(pathTemp);
        filesTemp.forEach(function (srcFile) {
            fs_1.default.renameSync(pathTemp + "/" + srcFile, pathPost + "/" + srcFile);
        });
        return filesTemp;
    };
    FileSystem.prototype.getImgTemp = function (pathTemp) {
        return fs_1.default.readdirSync(pathTemp) || [];
    };
    return FileSystem;
}());
exports.default = FileSystem;
