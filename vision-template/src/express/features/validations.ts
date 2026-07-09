import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod.js';

const requiredFields = z
    .object({
        name: z.string(),
    })
    .required();

const optionalFields = z
    .object({
        age: z.number(),
    })
    .partial();

// GET /api/features
export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z
        .object({
            step: z.coerce.number().min(0).default(0),
            limit: z.coerce.number().optional(),
        })
        .merge(requiredFields.partial())
        .merge(optionalFields),
    params: z.object({}),
});

// GET /api/features/count
export const getCountRequestSchema = z.object({
    body: z.object({}),
    query: requiredFields.partial().merge(optionalFields),
    params: z.object({}),
});

// GET /api/features/:id
export const getByIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// POST /api/features
export const createOneRequestSchema = z.object({
    body: requiredFields.merge(optionalFields),
    query: z.object({}),
    params: z.object({}),
});

export const createSystemServiceSchema = z.object({
    body: z.object({
        name: z.string(),
        parentId: zodMongoObjectId.nullable(),
    }),
    query: z.object({}),
    params: z.object({}),
});

// PUT /api/features/:id
export const updateOneRequestSchema = z.object({
    body: requiredFields.partial().merge(optionalFields),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// DELETE /api/features/:id
export const deleteOneRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});
