type BaseUser = {
    username: string;
    email: string;
    role: "ADMIN" | "EDITOR" | "VIEWER";
};


export interface CreateLocalUserPayload extends BaseUser {
    password: string; 
}


export interface GoogleAuthPayload {
    googleId: string; // token.sub
    email: string;    // token.email
}


type AuthMethod =
    | { passwordHash: string; googleId?: string }
    | { googleId: string; passwordHash?: string };

export type User = BaseUser & AuthMethod;


export type UserDocument = User & {
    _id: string;
};