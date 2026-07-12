import mongoose from 'mongoose';
import { CreateCircleError, DocumentNotFoundError, SystemWithChildrenError } from '../../utils/errors.js';
import { CreateSystemServicePayload, SystemService, SystemServiceDocument } from './interface.js';
import { SystemServiceModel } from './model.js';

export class SystemServiceManager {
    static getByQuery = async (query: Partial<SystemService>, step: number, limit?: number): Promise<SystemServiceDocument[]> => {
        return SystemServiceModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .lean()
            .exec();
    };

    static getCount = async (query: Partial<SystemService>): Promise<number> => {
        return SystemServiceModel.countDocuments(query).exec();
    };

    static getById = async (systemId: string): Promise<SystemServiceDocument> => {
        return SystemServiceModel.findById(systemId).orFail(new DocumentNotFoundError(systemId)).lean().exec();
    };

    static getRoots = async (step: number, limit?: number): Promise<SystemServiceDocument[]> => {
        return SystemServiceModel.find({parentId: null}, {}, limit ? { limit, skip: limit * step } : {})
            .lean()
            .exec();
    };

    static createOne = async (createSystemServicePayload: CreateSystemServicePayload, createdBy: string /* until auth */): Promise<SystemServiceDocument> => {
        return SystemServiceModel.create({
            createdBy: createdBy,
            name: createSystemServicePayload.name,
            parentId: createSystemServicePayload.parentId,
        });
    };

    static deleteOne = async (systemId: string): Promise<SystemServiceDocument> => {
        return SystemServiceModel.findByIdAndDelete(systemId).orFail(new DocumentNotFoundError(systemId)).lean().exec();
    };

    static editService = async (systemId: string, update:  Omit<Partial<SystemServiceDocument>, 'status'>): Promise<SystemServiceDocument> => {
        if (update.parentId) {
            if (await this.checkForCycles(systemId, update.parentId)) {
                throw new CreateCircleError(systemId, update.parentId);
            }
        }
        
        return SystemServiceModel.findByIdAndUpdate(systemId, update, { new: true }).orFail(new DocumentNotFoundError(systemId)).lean().exec();
    }

    static changeStatus = async (systemId: string,  status: "UP" | "DOWN"): Promise<SystemServiceDocument> => {
        if (await this.checkForKids(systemId)) {
            throw new SystemWithChildrenError(systemId);
        }
        
        return SystemServiceModel.findByIdAndUpdate(systemId, {$set: {status: status, statusUpdatedAt: Date.now()}}, {new: true})
            .orFail(new DocumentNotFoundError(systemId)).lean().exec();
    }

    static checkForCycles = async (systemId: string, parentId: string): Promise<boolean> => {
        const result = await SystemServiceModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(parentId)}
            },
            {
                $graphLookup: {
                    from: 'system-services',
                    startWith: '$_id',
                    connectFromField: 'parentId',
                    connectToField: '_id',
                    as: 'parents',
                    maxDepth: 10,
                }
            }
        ]);

        if (result.length === 0) {
            return false; // if the id does not exist
        }

        const parents = result[0].parents; // only one object matches

        return parents.some((parent: SystemServiceDocument) =>
            new mongoose.Types.ObjectId(parent._id).equals(systemId)
    );
    };

    static checkForKids = async (systemId: string): Promise<boolean> => {
        const result = await SystemServiceModel.exists({
            parentId: systemId,
        });

        return result ? true : false;
    };
}