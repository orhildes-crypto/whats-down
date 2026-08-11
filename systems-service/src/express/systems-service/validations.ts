import { zodMongoObjectId } from '@whats-down/shared';
import { createSystemBodySchema, systemRequiredFields, systemQueryParamsSchema } from '@whats-down/shared/common';
import { z } from 'zod';

// GET /api/system-service
export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: systemQueryParamsSchema,
    params: z.object({}),
});

// GET /api/system-service/roots
export const getRootsByQueryRequestSchema = z.object({
    body: z.object({}),
    query: systemQueryParamsSchema.omit({ parentId: true }),
    params: z.object({}),
});

// GET /api/system-service/count
export const getCountRequestSchema = z.object({
    body: z.object({}),
    query: systemRequiredFields.partial(),
    params: z.object({}),
});

// GET /api/system-service/:id
export const getByIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// GET /api/system-service/:id/ancestors
export const getAncestorsByIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// POST /api/system-service
export const createOneRequestSchema = z.object({
    body: createSystemBodySchema,
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
