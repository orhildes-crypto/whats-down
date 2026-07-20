type BaseUser = {
    username: string;
    email: string;
    role: "ADMIN" | "EDITOR" | "VIEWER";
};


export interface CreateLocalUserPayload extends BaseUser {
    password: string; 
}

type AuthMethod = {
    passwordHash: string; 
    googleId?: string;      
};

export type User = BaseUser & AuthMethod;


export type UserDocument = User & {
    _id: string;
};

export type SafeUserDocument = Omit<UserDocument, 'passwordHash' | 'googleId'>;

export interface AuthResult {
    user: SafeUserDocument;
    token: string;
}