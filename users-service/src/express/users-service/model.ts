import { config } from '@/config.js';
import { UserRole } from '@whats-down/shared';
import mongoose from 'mongoose';
import { UserDocument } from './interface.js';

const UserSchema = new mongoose.Schema<UserDocument>(
    {
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: false,
            default: UserRole.VIEWER,
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

export const UserModel = mongoose.model<UserDocument>('User', UserSchema, config.mongo.userCollectionName);
