import mongoose from 'mongoose';
import { config } from '../../config.js';
import { UserDocument } from './interface.js';


const UserSchema = new mongoose.Schema<UserDocument>(
    {
        role: {
            type: String,
            enum: ['ADMIN', 'EDITOR', 'VIEWER'],
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,  
            required: true,
            select: false,
        },
        googleId: {
            type: String,  
            required: false,
            unique: true,
            sparse: true,
        },
    },
    {
        versionKey: false,
    },
);

export const UserModel = mongoose.model<UserDocument>(config.mongo.userCollectionName, UserSchema);
