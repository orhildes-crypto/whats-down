import mongoose from 'mongoose';
import { config } from '../../config.js';
import { UserDocument } from './interface.js';
import { GoogleIdOrPasswordRequiredError } from '../../utils/errors.js';


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
            required: false,
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

// Validating that either googleId or passwordHash is provided
UserSchema.pre('validate', function(next) {
  if (!this.googleId && !this.passwordHash) {
    return next(new GoogleIdOrPasswordRequiredError());
  }

  next();
});

export const UserModel = mongoose.model<UserDocument>(config.mongo.userCollectionName, UserSchema);
