import { z } from 'zod';
import { UserRole, zodMongoObjectId, userQueryParamsSchema, createLocalUserSchema } from '@whats-down/shared';

// GET /users-service/me
export const getMeRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({}),
});

// GET /users-service
export const getUsersRequestSchema = z.object({
    body: z.object({}),
    query: userQueryParamsSchema,
    params: z.object({}),
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

// PUT /users-service/:id/role
export const changeUserRoleRequestSchema = z.object({
    body: z.object({
        role: z.nativeEnum(UserRole),
    }),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// POST /users-service/logout
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
