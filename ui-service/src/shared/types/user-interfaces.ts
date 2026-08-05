import type { UserRole } from "../../../../shared/dist/userInterfaces";

type BaseUser = {
    username: string;
    email: string;
    role: UserRole;
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
