"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
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
    imgUser: {
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
exports.User = mongoose_1.model('User', userSchema);
