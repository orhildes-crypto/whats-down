import { SystemStatus } from "@whats-down/shared";
import { createOneRequestSchema } from "./validations.js";
import z from "zod";

export type CreateSystemPayload = z.infer<typeof createOneRequestSchema>['body'];

export interface System extends CreateSystemPayload {
    createdBy: string;
    status: SystemStatus;
    createdAt: Date;
    statusUpdatedAt: Date;
    createdByUsername: string;
    statusPriority: number;
    hasChildren: boolean;
}

export interface SystemDocument extends System {
    _id: string;
}
