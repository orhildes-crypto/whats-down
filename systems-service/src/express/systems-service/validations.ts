import { z } from 'zod';
import { SystemStatus, zodMongoObjectId } from '@whats-down/shared';
import { config } from '../../config.js';

const nameSchema = z.string().min(config.name.minLettersAmount).max(config.name.maxLettersAmount);

// GET /api/system-service
export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        step: z.coerce.number().min(0).default(0),
        limit: z.coerce.number().optional(),
        name: nameSchema.optional(),
        parentId: zodMongoObjectId.optional(),
    }),
    params: z.object({}),
});

// GET /api/system-service/roots
export const getRootsByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        step: z.coerce.number().min(0).default(0),
        limit: z.coerce.number().optional(),
        name: nameSchema.optional(),
    }),
    params: z.object({}),
});

// GET /api/system-service/count
export const getCountRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        name: nameSchema.optional(),
        parentId: zodMongoObjectId.optional(),
    }),
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
    body: z.object({
        name: nameSchema,
        parentId: zodMongoObjectId.nullable(),
    }),
    query: z.object({}),
    params: z.object({}),
});

// PUT /api/system-service/:id/name
export const editServiceRequestSchema = z.object({
    body: z.object({
        name: nameSchema,
    }),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    })
})

// PUT /api/system-service/:id/status
export const changeStatusRequestSchema = z.object({
    body: z.object({
        status: z.enum([SystemStatus.UP, SystemStatus.DOWN]),
    }),
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
