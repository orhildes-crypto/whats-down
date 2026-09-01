import { zodMongoObjectId } from '@whats-down/shared';
import { createSystemBodySchema, systemRequiredFields, systemQueryParamsSchema, createMockSystemsBodySchema } from '@whats-down/shared';
import { z } from 'zod';

// GET /system-service
export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: systemQueryParamsSchema,
    params: z.object({}),
});

// GET /system-service/roots
export const getRootsByQueryRequestSchema = z.object({
    body: z.object({}),
    query: systemQueryParamsSchema.omit({ parentId: true }),
    params: z.object({}),
});

// GET /system-service/count
export const getCountRequestSchema = z.object({
    body: z.object({}),
    query: systemRequiredFields.partial(),
    params: z.object({}),
});

// GET /system-service/:id
export const getByIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// GET /system-service/:id/parents
export const getParentsByIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// POST /system-service
export const createOneRequestSchema = z.object({
    body: createSystemBodySchema,
    query: z.object({}),
    params: z.object({}),
});

// POST /system-service/many
export const createManyRequestSchema = z.object({
    body: createMockSystemsBodySchema,
    query: z.object({}),
    params: z.object({}),
});

// PUT /api/system-service/:id/name
export const editServiceRequestSchema = z.object({
    body: systemRequiredFields.pick({ name: true }),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// PUT /api/system-service/:id/status
export const changeStatusRequestSchema = z.object({
    body: systemRequiredFields.pick({ status: true }),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// DELETE /api/system-service/:id
export const deleteOneRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});
