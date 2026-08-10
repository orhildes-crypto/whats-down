import { SystemStatus } from "@whats-down/shared";

export interface CreateSystemPayload {
    name: string;
    parentId: string | null;
}

export interface System extends CreateSystemPayload {
    createdBy: string;
    status: SystemStatus;
    createdAt: Date;
    statusUpdatedAt: Date;
    createdByUsername: string;
    statusPriority: number;
    hasChildren: boolean;
}

export interface SystemDocument extends System {
    _id: string;
}

export interface SystemCubeDTO extends SystemDocument {
    hasChildren: boolean;
}