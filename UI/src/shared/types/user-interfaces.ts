type BaseUser = {
    username: string;
    email: string;
    role: "ADMIN" | "EDITOR" | "VIEWER";
};

// Does not have a role 
export interface CreateLocalUserPayload {
    username: string;
    email: string;
    password: string; 
}

export type SafeUserDocument = BaseUser & {
    _id: string;
};
