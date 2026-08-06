import type { SystemStatus } from "@whats-down/shared";

export interface CreateSystemPayload {
    name: string;
    parentId: string | null;
}

export interface SystemDocument extends CreateSystemPayload {
    _id: string;
    createdBy: string;
    status: SystemStatus;
    createdAt: string;
    statusUpdatedAt: string;
    createdByUsername: string;
    statusPriority: number;
}

export interface SystemCubeDTO extends SystemDocument {
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

