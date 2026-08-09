import { Schema, model } from 'mongoose';
import { RefreshTokenDocument, RevocationReason} from './interface.js';

export const refreshTokenSchema = new Schema<RefreshTokenDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        username: {
            type: String,
            required: true
        },
        tokenHash: {
            type: String,
            required: true,
        },
        familyId: {
            type: String,
            required: true,
        },
        generation: {
            type: Number,
            required: true,
        },
        isRevoked: {
            type: Boolean,
            required: true,
            default: false,
        },
        revocationReason: {
            type: String,
            enum: Object.values(RevocationReason),
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        deleteAt: {
            type: Date,
            required: true,
        },
        usedAt: { type: Date },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false,
    },
);

refreshTokenSchema.index({ tokenHash: 1 }, { unique: true });
refreshTokenSchema.index({ familyId: 1 });
refreshTokenSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model<RefreshTokenDocument>('RefreshToken', refreshTokenSchema);
