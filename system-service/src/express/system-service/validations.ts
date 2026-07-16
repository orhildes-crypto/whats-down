import { z } from 'zod';
import { zodMongoObjectId } from '@whats-down/shared';

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 15;

const requiredFields = z
    .object({
        name: z.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
    })
    .required();

const optionalFields = z
    .object({
        parentId: zodMongoObjectId.nullish(),
    })
    .partial();

// GET /api/system-service
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

// GET /api/system-service/roots
export const getRootsByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z
        .object({
            step: z.coerce.number().min(0).default(0),
            limit: z.coerce.number().optional(),
        })
        .merge(requiredFields.partial()),
    params: z.object({}),
});

// GET /api/system-service/count
export const getCountRequestSchema = z.object({
    body: z.object({}),
    query: requiredFields.partial().merge(optionalFields),
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

// POST /api/system-service
export const createOneRequestSchema = z.object({
    body: requiredFields.merge(z.object({
        parentId: zodMongoObjectId.nullable(),
    })),
    query: z.object({}),
    params: z.object({}),
});

// PUT /api/system-service/:id
export const editServiceRequestSchema = z.object({
    body: requiredFields.partial().merge(optionalFields).refine(
        (data) => Object.keys(data).length > 0,
        { message: "At least one field must be provided for update" }
    ),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    })
})

// PATCH /api/system-service/:id/status
export const changeStatusRequestSchema = z.object({
    body: z.object({
        status: z.enum(["UP" , "DOWN"]),
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
