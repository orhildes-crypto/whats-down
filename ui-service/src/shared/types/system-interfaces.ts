export interface CreateSystemPayload {
    name: string;
    parentId: string | null;
}

export interface SystemDocument extends CreateSystemPayload {
    _id: string;
    createdBy: string;
    status: 'UP' | 'DOWN';
    createdAt: string;
    statusUpdatedAt: string;
    createdByUsername: string;
}

export interface SystemCubeDTO extends SystemDocument {
    hasChildren: boolean;
}

export interface SystemFilters {
    createdBy?: string;
    status?: 'UP' | 'DOWN';
    parentId?: string | null;
    name?: string;
}

export interface SystemQueryParams extends SystemFilters {
    step: number;
    limit?: number;
}

