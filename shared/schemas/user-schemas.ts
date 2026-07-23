import { z } from 'zod';

const baseUserSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
});

export const createLocalUserSchema = baseUserSchema.extend({
    password: z.string().min(8),
});