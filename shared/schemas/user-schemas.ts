import { z } from 'zod';
import { PASSWORD_TOO_SHORT, USER_NAME_TOO_SHORT } from '../constants/userConstants.js';

const baseUserSchema = z.object({
    username: z.string().min(USER_NAME_TOO_SHORT),
    email: z.string().email(),
});

export const createLocalUserSchema = baseUserSchema.extend({
    password: z.string().min(PASSWORD_TOO_SHORT),
});