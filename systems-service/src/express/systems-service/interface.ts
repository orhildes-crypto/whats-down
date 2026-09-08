import { SystemDocument } from '@whats-down/shared';

export type { SystemStatus, CreateSystemPayload, System, SystemDocument } from '@whats-down/shared';

export type StatusUpdateResult = {
    system: SystemDocument;
    changed: boolean;
};
