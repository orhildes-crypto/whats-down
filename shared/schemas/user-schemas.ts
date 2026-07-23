import { z } from 'zod';

const baseUserSchema = z.object({
    username: z.string().min(2),
    email: z.string().email(),
    role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).default('VIEWER'),
});

export const createLocalUserSchema = baseUserSchema.extend({
    password: z.string().min(8),
});