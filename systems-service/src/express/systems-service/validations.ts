import { config } from '@/config.js';
import { SystemStatus, zodMongoObjectId } from '@whats-down/shared';
import { z } from 'zod';

const requiredFields = z.object({
    name: z.string().min(config.name.minLettersAmount).max(config.name.maxLettersAmount),
    parentId: zodMongoObjectId,
    createdBy: zodMongoObjectId,
    createdByUsername: z.string(),
    status: z.nativeEnum(SystemStatus),
    statusPriority: z.number(),
    hasChildren: z.coerce.boolean(),
    createdAt: z.coerce.date(),
    statusUpdatedAt: z.coerce.date(),
});

// GET /api/system-service
export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z
        .object({
            step: z.coerce.number().min(0).default(0),
            limit: z.coerce.number().optional(),
        })
        .merge(requiredFields.partial()),
    params: z.object({}),
});

// GET /api/system-service/roots
export const getRootsByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z
        .object({
            step: z.coerce.number().min(0).default(0),
            limit: z.coerce.number().optional(),
        })
        .merge(requiredFields.omit({ parentId: true }).partial()),
    params: z.object({}),
});

// GET /api/system-service/count
export const getCountRequestSchema = z.object({
    body: z.object({}),
    query: requiredFields.partial(),
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
    body: requiredFields.pick({ name: true, parentId: true }).extend({
        parentId: zodMongoObjectId.nullable(),
    }),
    query: z.object({}),
    params: z.object({}),
});

// PUT /api/system-service/:id/name
export const editServiceRequestSchema = z.object({
    body: requiredFields.pick({ name: true }),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// PUT /api/system-service/:id/status
export const changeStatusRequestSchema = z.object({
    body: requiredFields.pick({ status: true }),
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
