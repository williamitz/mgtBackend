import { Schema, Document, model } from 'mongoose';
import mongoose from 'mongoose';

const PostSchema = new Schema({
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
    user: mongoose.Types.ObjectId;
}

export const Post = model<IPost>('Post', PostSchema);