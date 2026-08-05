export interface CreateSystemServicePayload {
    name: string;
    parentId: string | null ;
}

export interface SystemService extends CreateSystemServicePayload {
    createdBy: string;
    status: "UP" | "DOWN";
    createdAt: Date;
    statusUpdatedAt: Date;
    createdByUsername: string;
}

export interface SystemServiceDocument extends SystemService {
    _id: string;
}

export interface SystemCubeDTO extends SystemServiceDocument {
    hasChildren: boolean;
}