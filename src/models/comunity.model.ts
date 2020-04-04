import {Schema, model, Document} from 'mongoose';
import mongoose from 'mongoose';

const followerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
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

const comunitySchema = new Schema({
    followers: {
        type: Array<IFollower>(),
        default: []
    }, //[ followerSchema ], // seguidores
    followed: {
        type: Array<IFollower>(),
        default: []
    },// [ followerSchema ], // seguidos
    user: {
        type: Schema.Types.ObjectId,
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
            type: Schema.Types.ObjectId,
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
            type: Schema.Types.ObjectId,
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
            type: Schema.Types.ObjectId,
            required: false
        },
        ipUser: {
            type: String,
            required: false
        }
    }
});

interface IFollower {
    user: mongoose.Types.ObjectId;
    dateFollow: Date;
    locked: boolean;
}


// interface IFollowed {
//     user: String;
//     dateFollow: Date;
//     locked: boolean;
// }

interface IAudit {
    date: Date;
    idUser: string;
    ipUser: string;
}

interface IComunity extends Document {
    followers: IFollower[];
    followed: IFollower[];
    user: mongoose.Types.ObjectId;
    statusRegister?: boolean;
    registered?: IAudit;
    updated?: IAudit;
    deleted?: IAudit;
}

export const Comunity = model<IComunity>('Comunity', comunitySchema);