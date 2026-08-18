import { z } from 'zod';
import {
    systemRequiredFields,
    createSystemBodySchema,
    systemFiltersSchema,
    systemQueryParamsSchema,
} from '../schemas/system-schemas.js';

export enum SystemStatus {
    UP = 'UP',
    DOWN = 'DOWN',
}

export const SystemStatusPriority: Record<SystemStatus, number> = {
    [SystemStatus.DOWN]: 0,
    [SystemStatus.UP]: 1,
};

export type SystemFilters = z.infer<typeof systemFiltersSchema>;
export type SystemQueryParams = z.infer<typeof systemQueryParamsSchema>;
export type CreateSystemPayload = z.infer<typeof createSystemBodySchema>;

type BaseSystemFromSchema = z.infer<typeof systemRequiredFields>;

export interface System extends Omit<BaseSystemFromSchema, 'parentId' | 'createdAt' | 'statusUpdatedAt' | 'createdBy'> {
    parentId: string | null;
    createdBy: string;
    createdAt: Date | string;
    statusUpdatedAt: Date | string;
}

export interface SystemDocument extends System {
    _id: string;
}