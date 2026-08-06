import { SystemStatus } from "../../../../shared/dist/interfaces/systemInterfaces.js";

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
}

export interface SystemDocument extends System {
    _id: string;
}

export interface SystemCubeDTO extends SystemDocument {
    hasChildren: boolean;
}