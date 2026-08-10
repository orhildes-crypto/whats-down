import { UserRole } from '@whats-down/shared';
import { createLocalUserSchema } from '@whats-down/shared/common';
import z from 'zod';

type BaseUser = {
    username: string;
    email: string;
    role: UserRole;
};

export type CreateLocalUserPayload = z.infer<typeof createLocalUserSchema>;

type AuthMethod = {
    passwordHash: string; 
    googleId?: string;      
};

export type User = BaseUser & AuthMethod;


export type UserDocument = User & {
    _id: string;
};

export type SafeUserDocument = Omit<UserDocument, keyof AuthMethod>;

export interface AuthResult {
    user: SafeUserDocument;
    token: string;
}