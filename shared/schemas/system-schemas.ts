// shared/src/schemas/system-schemas.ts
import { z } from 'zod';
import { SystemStatus } from '../interfaces/systemInterfaces.js';
import { zodMongoObjectId } from '../zod.js';
import { SYSTEM_MIN_NAME_LENGTH, SYSTEM_MAX_NAME_LENGTH } from '../constants/systemConstants.js';

export const systemRequiredFields = z.object({
    name: z.string().min(SYSTEM_MIN_NAME_LENGTH).max(SYSTEM_MAX_NAME_LENGTH),
    parentId: zodMongoObjectId,
    createdBy: zodMongoObjectId,
    createdByUsername: z.string(),
    status: z.nativeEnum(SystemStatus),
    statusPriority: z.number(),
    hasChildren: z.coerce.boolean(),
    createdAt: z.coerce.date(),
    statusUpdatedAt: z.coerce.date(),
});

export const createSystemBodySchema = systemRequiredFields.pick({ name: true, parentId: true }).extend({
    parentId: zodMongoObjectId.nullable(),
});