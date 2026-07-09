/* v8 ignore start */
export interface Feature {
    name: string;
    age?: number;
}

export interface FeatureDocument extends Feature {
    _id: string;
}

type BaseUser = {
    _id: string;
    username: string;
    email: string;
    role: "ADMIN" | "EDITOR" | "VIEWER";
};

type AuthMethod =
    | { passwordHash: string; googleId?: string }
    | { googleId: string; passwordHash?: string };

export type User = BaseUser & AuthMethod;

export interface CreateSystemServicePayload {
    name: string;
    parentId: string | null;
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