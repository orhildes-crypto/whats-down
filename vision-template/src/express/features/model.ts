import mongoose from 'mongoose';
import { config } from '../../config.js';
import { SystemServiceDocument } from './interface.js';

const { Schema } = mongoose;

const SystemServiceSchema = new mongoose.Schema<SystemServiceDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        parentId: {
            type: Schema.Types.ObjectId, 
            ref: 'SystemServiceModel',
            default: null 
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        createdBy: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["UP", "DOWN"],
            default: "UP",
        },
        statusUpdatedAt: {
            type: Date,
            required: true,
            default: Date.now,
        }

    },
    {
        versionKey: false,
    },
);


export const SystemServiceModel = mongoose.model<SystemServiceDocument>(config.mongo.systemServiceCollectionName, SystemServiceSchema);
