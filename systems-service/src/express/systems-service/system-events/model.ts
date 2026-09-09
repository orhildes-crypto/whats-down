import { SystemEventDocument, SystemStatus } from '@whats-down/shared';
import mongoose from 'mongoose';
import { config } from '@/config.js';

const SystemEventSchema = new mongoose.Schema<SystemEventDocument>(
    {
        systemId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(SystemStatus),
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

SystemEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
SystemEventSchema.index({ systemId: 1, createdAt: 1 });

export const SystemEventModel = mongoose.model<SystemEventDocument>('SystemEvent', SystemEventSchema, config.mongo.systemEventsCollectionName);
