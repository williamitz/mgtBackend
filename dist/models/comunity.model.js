"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var followerSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'el id del seguido/seguidor es requerido']
    },
    dateFollow: {
        type: Date,
        required: [true, 'La fecha de seguimiento es requerida']
    },
    locked: {
        type: Boolean,
        default: false
    }
});
var comunitySchema = new mongoose_1.Schema({
    followers: {
        type: Array(),
        default: []
    },
    followed: {
        type: Array(),
        default: []
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'El id del usuario en sesión es requerido']
    },
    statusRegister: {
        type: Boolean,
        default: true
    },
    registered: {
        date: {
            type: Date,
            default: new Date()
        },
        idUser: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: [true, 'El id del usuario de registro es requerida']
        },
        ipUser: {
            type: String,
            required: [true, 'El ip de la petición es requerida']
        }
    },
    updated: {
        date: {
            type: Date,
            required: false
        },
        idUser: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: false
        },
        ipUser: {
            type: String,
            required: false
        }
    },
    deleted: {
        date: {
            type: Date,
            required: false
        },
        idUser: {
            type: mongoose_1.Schema.Types.ObjectId,
            required: false
        },
        ipUser: {
            type: String,
            required: false
        }
    }
});
exports.Comunity = mongoose_1.model('Comunity', comunitySchema);
