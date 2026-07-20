type BaseUser = {
    username: string;
    email: string;
    role: "ADMIN" | "EDITOR" | "VIEWER";
};

export interface CreateLocalUserPayload extends BaseUser {
    password: string;
}

export type SafeUserDocument = BaseUser & {
    _id: string;
};