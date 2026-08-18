import { z } from 'zod';
import { SystemStatus } from '../interfaces/systemInterfaces.js';
import { zodMongoObjectId } from '../zod.js';
import { SYSTEM_MIN_NAME_LENGTH, SYSTEM_MAX_NAME_LENGTH } from '../constants/systemConstants.js';

export const systemRequiredFields = z.object({
    name: z.string().min(SYSTEM_MIN_NAME_LENGTH).max(SYSTEM_MAX_NAME_LENGTH),
    parentId: zodMongoObjectId,
    createdBy: zodMongoObjectId,
    createdByUsername: z.string(),
    status: z.nativeEnum(SystemStatus).default(SystemStatus.UP),
    hasChildren: z.coerce.boolean(),
    createdAt: z.coerce.date(),
    statusUpdatedAt: z.coerce.date(),
});

export const createSystemBodySchema = systemRequiredFields.pick({ name: true, parentId: true, status: true }).extend({
    parentId: zodMongoObjectId.nullable(),
});

export const systemFiltersSchema = systemRequiredFields
    .pick({ name: true, status: true, parentId: true, createdByUsername: true, hasChildren: true })
    .partial();

export const systemQueryParamsSchema = systemFiltersSchema.extend({
    step: z.coerce.number().min(0).default(0),
    limit: z.coerce.number().optional().default(10),
});
