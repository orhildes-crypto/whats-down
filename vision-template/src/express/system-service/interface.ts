export interface CreateSystemServicePayload {
    name: string;
    parentId: string | null ;
}

export interface SystemService extends CreateSystemServicePayload {
    createdBy: string;
    status: "UP" | "DOWN";
    createdAt: Date;
    statusUpdatedAt: Date;
}

export interface SystemServiceDocument extends SystemService {
    _id: string;
}