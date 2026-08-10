import type { UserRole } from "@whats-down/shared/common";
import { createLocalUserSchema } from "@whats-down/shared/common";
import { z } from 'zod';

type BaseUser = {
    username: string;
    email: string;
    role: UserRole;
};

export type CreateLocalUserPayload = z.infer<typeof createLocalUserSchema>;

export type SafeUserDocument = BaseUser & {
    _id: string;
};
