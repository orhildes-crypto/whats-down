export interface CreateSystemServicePayload {
    name: string;
    parentId: string | null;
}

export interface SystemServiceDocument extends CreateSystemServicePayload {
    _id: string;
    createdBy: string;
    status: "UP" | "DOWN";
    createdAt: Date;
    statusUpdatedAt: Date;
}