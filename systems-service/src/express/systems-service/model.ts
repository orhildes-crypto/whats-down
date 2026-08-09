import { SystemStatus } from '@whats-down/shared';
import mongoose from 'mongoose';
import { config } from '../../config.js';
import { SystemDocument } from './interface.js';

const { Schema } = mongoose;

const SystemServiceSchema = new mongoose.Schema<SystemDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: config.model.name,
            default: null,
        },
        createdBy: {
            type: String,
            required: true,
        },
        createdByUsername: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: Object.values(SystemStatus),
            default: SystemStatus.UP,
        },
        statusPriority: {
            type: Number,
            required: true,
            default: 1, 
        },
        statusUpdatedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

SystemServiceSchema.index({ statusPriority: 1, name: 1 }); 

export const SystemServiceModel = mongoose.model<SystemDocument>('System', SystemServiceSchema, config.mongo.systemServiceCollectionName);
