import { z } from 'zod';
import { zodMongoObjectId } from '@whats-down/shared';

const baseUserSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).default('VIEWER'),
});

export const createLocalUserSchema = baseUserSchema.extend({
    password: z.string().min(8),
});

// POST /users-service/signup
export const createOneRequestSchema = z.object({
    body: createLocalUserSchema,
    query: z.object({}),
    params: z.object({}),
});

// POST /users-service/login 
export const loginRequestSchema = z.object({
    body: z.object({
        username: z.string(),
        password: z.string(),
    }),
    query: z.object({}),
    params: z.object({}),
});

// POST /users-service/login/google
export const googleAuthRequestSchema = z.object({
    body: z.object({
        idToken: z.string(),
    }),
    query: z.object({}),
    params: z.object({}),
});

// PATCH /users-service/:id/role
export const changeUserRoleRequestSchema = z.object({
    body: z.object({
        role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
    }),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// Post /users-service/logout
export const logoutRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({}),
});

// DELETE /users-service/:id
export const deleteOneRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});