"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var bcrypt_1 = __importDefault(require("bcrypt"));
var userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Los nombres son requeridos']
    },
    surname: {
        type: String,
        required: [true, 'Los apellidos son requeridos']
    },
    nameComplete: {
        type: String,
        required: [true, 'El nombre completo es requerido']
    },
    nameUser: {
        type: String,
        required: [true, 'El nombre de usuario es requerido'],
        unique: [true, 'Ya existe este nombre de usuario en la base de datos']
    },
    passwordUser: {
        type: String,
        required: [true, 'La clave de usuario es requerida'],
    },
    email: {
        type: String,
        required: false,
        default: ''
    },
    phone: {
        type: String,
        required: false,
        default: ''
    },
    imgUser: {
        type: String,
        required: false,
        default: ''
    },
    sex: {
        type: String,
        required: false,
        default: 'O'
    },
    dateBorn: {
        type: Date,
        required: false
    },
    aboutMe: {
        type: String,
        required: false,
        default: ''
    },
    google: {
        type: Boolean,
        default: false
    },
    facebook: {
        type: Boolean,
        default: false
    },
    statusRegister: {
        type: Boolean,
        default: true
    },
    registered: {
        type: Object,
        required: false
    },
    updated: {
        type: Object,
        required: false
    },
    deleted: {
        type: Object,
        required: false
    }
});
userSchema.method('comparePassword', function (password) {
    if (bcrypt_1.default.compareSync(password, this.passwordUser)) {
        return true;
    }
    else {
        return false;
    }
});
exports.User = mongoose_1.model('User', userSchema);
