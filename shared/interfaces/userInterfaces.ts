import { z } from 'zod';
import {
    userFiltersSchema,
    userQueryParamsSchema,
    createLocalUserSchema,
    baseUserSchema,
    authMethodSchema,
    fullUserSchema,
} from '../schemas/user-schemas.js';

export enum UserRole {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    VIEWER = 'VIEWER',
}

export type BaseUser = z.infer<typeof baseUserSchema>;
export type AuthMethod = z.infer<typeof authMethodSchema>;
export type User = z.infer<typeof fullUserSchema>;

export type UserFilters = z.infer<typeof userFiltersSchema>;
export type UserQueryParams = z.infer<typeof userQueryParamsSchema>;
export type CreateLocalUserPayload = z.infer<typeof createLocalUserSchema>;

export interface UserDocument extends User {
    _id: string;
}

export type SafeUserDocument = Omit<UserDocument, keyof AuthMethod>;

export interface AuthResult {
    user: SafeUserDocument;
    token: string;
}