import type { SystemStatus, createSystemBodySchema, systemFiltersSchema,  systemQueryParamsSchema} from "@whats-down/shared/common";
import { z } from 'zod';

export type SystemFilters = z.infer<typeof systemFiltersSchema>;
export type SystemQueryParams = z.infer<typeof systemQueryParamsSchema>;
export type CreateSystemPayload = z.infer<typeof createSystemBodySchema>;

export interface SystemDocument extends CreateSystemPayload {
    _id: string;
    createdBy: string;
    status: SystemStatus;
    createdAt: string;
    statusUpdatedAt: string;
    createdByUsername: string;
    statusPriority: number;
    hasChildren: boolean;
}

