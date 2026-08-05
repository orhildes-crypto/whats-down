export interface CreateSystemServicePayload {
    name: string;
    parentId: string | null;
}

export interface SystemServiceDocument extends CreateSystemServicePayload {
    _id: string;
    createdBy: string;
    status: 'UP' | 'DOWN';
    createdAt: string;
    statusUpdatedAt: string;
    createdByUsername: string;
}

export interface SystemCubeDTO extends SystemServiceDocument {
    hasChildren: boolean;
}

export interface SystemServiceFilters {
    createdBy?: string;
    status?: 'UP' | 'DOWN';
    parentId?: string | null;
    name?: string;
}

export interface SystemQueryParams extends SystemServiceFilters {
    step: number;
    limit?: number;
}

