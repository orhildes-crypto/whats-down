import type { SystemStatus, createSystemBodySchema } from "@whats-down/shared/common";
import { z } from 'zod';

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

export interface SystemFilters {
    createdBy?: string;
    status?: SystemStatus;
    parentId?: string | null;
    name?: string;
}

export interface SystemQueryParams extends SystemFilters {
    step: number;
    limit?: number;
}

