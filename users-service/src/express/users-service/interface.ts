import { UserRole } from '@whats-down/shared';

type BaseUser = {
    username: string;
    email: string;
    role: UserRole;
};

export interface CreateLocalUserPayload {
    username: string;
    email: string;
    password: string; 
}

type AuthMethod = {
    passwordHash: string; 
    googleId?: string;      
};

export type User = BaseUser & AuthMethod;


export type UserDocument = User & {
    _id: string;
};

export type SafeUserDocument = Omit<UserDocument, 'passwordHash' | 'googleId'>;

export interface AuthResult {
    user: SafeUserDocument;
    token: string;
}