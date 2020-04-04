import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

let userSchema = new Schema({
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
    accountPrivate: {
        type: Boolean,
        required: [true, 'La privacidad de la cuenta es requerida']
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
        enum: ['M', 'F', 'O'],
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

userSchema.methods.toJson = function() {
    let user = this;
    let userObj = user.toObject();
    delete userObj.passwordUser;
    return userObj;
}

userSchema.method('comparePassword', function (password: string): boolean {

    if ( bcrypt.compareSync( password, this.passwordUser ) ) {
        return true;
    } else {
        return false;
    }
    
});

interface IUser extends Document {
    name: string;
    surname: string;
    nameComplete: string;
    nameUser: string;
    passwordUser: string;
    accountPrivate: boolean;
    email: string;
    phone: string;
    imgUser: string;
    sex: string;
    dateBorn: Date;
    aboutMe: string;
    google: boolean;
    facebook: boolean;
    statusRegister: boolean;
    registered: Object;
    updated: Object;
    deleted: Object;

    comparePassword( password: string ): boolean;
}

export const User =  model<IUser>( 'User', userSchema );