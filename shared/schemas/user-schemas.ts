import { z } from 'zod';
import { PASSWORD_TOO_SHORT, USER_NAME_TOO_SHORT } from '../constants/userConstants.js';
import { UserRole } from '../common.js';

export const baseUserSchema = z.object({
    username: z.string().min(USER_NAME_TOO_SHORT),
    email: z.string().email(),
    role: z.nativeEnum(UserRole),
});

export const authMethodSchema = z.object({
    passwordHash: z.string(),
    googleId: z.string().optional(),
});

export const fullUserSchema = baseUserSchema.merge(authMethodSchema);

export const createLocalUserSchema = baseUserSchema.pick({ username: true, email: true }).extend({
    password: z.string().min(PASSWORD_TOO_SHORT),
});

export const userFiltersSchema = fullUserSchema.pick({ username: true, email: true, role: true }).partial();

export const userQueryParamsSchema = userFiltersSchema.extend({
    step: z.coerce.number().min(0).default(0),
    limit: z.coerce.number().optional(),
});
