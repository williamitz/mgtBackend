import { Schema, Document, model } from 'mongoose';

let PostSchema = new Schema({
    created: {
        type: Date
    },
    message: {
        type: String
    },
    img: [{
        type: String
    }],
    coords: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number]
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [ true, 'El usuario es requerido' ]
    }
});

PostSchema.pre<IPost>('save', function( next ) {

    this.created = new Date();
    next();
    
});

interface IPost extends Document {
    created: Date;
    message: String;
    img: String;
    coords: Object;
    user: String;
}

export const Post = model<IPost>('Post', PostSchema);