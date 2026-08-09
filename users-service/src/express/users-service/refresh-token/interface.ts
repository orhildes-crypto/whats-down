import { Types } from 'mongoose';

export enum RevocationReason {
    USER_LOGOUT = 'USER_LOGOUT',
    ADMIN_ACTION = 'ADMIN_ACTION',
    FAMILY_COMPROMISED = 'FAMILY_COMPROMISED',
}

export interface RefreshTokenDocument {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    username: string;

    tokenHash: string;

    familyId: string;
    generation: number;

    isRevoked: boolean;
    revocationReason?: RevocationReason;

    expiresAt: Date;
    deleteAt: Date;
    createdAt: Date;
    usedAt?: Date;
}
