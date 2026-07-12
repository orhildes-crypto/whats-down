import { DocumentNotFoundError } from '../../utils/errors.js';
import { SystemService, SystemServiceDocument } from './interface.js';
import { SystemServiceModel } from './model.js';

export class FeaturesManager {
    static getByQuery = async (query: Partial<Feature>, step: number, limit?: number): Promise<SystemServiceDocument[]> => {
        return SystemServiceModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .lean()
            .exec();
    };

    static getCount = async (query: Partial<Feature>): Promise<number> => {
        return SystemServiceModel.countDocuments(query).lean().exec();
    };

    static getById = async (featureId: string): Promise<SystemServiceDocument> => {
        return SystemServiceModel.findById(featureId).orFail(new DocumentNotFoundError(featureId)).lean().exec();
    };

    static createOne = async (systemService: SystemService): Promise<SystemServiceDocument> => {
        return SystemServiceModel.create(systemService);
    };

    static updateOne = async (featureId: string, update: Partial<Feature>): Promise<SystemServiceDocument> => {
        return SystemServiceModel.findByIdAndUpdate(featureId, update, { new: true }).orFail(new DocumentNotFoundError(featureId)).lean().exec();
    };

    static deleteOne = async (featureId: string): Promise<SystemServiceDocument> => {
        return SystemServiceModel.findByIdAndDelete(featureId).orFail(new DocumentNotFoundError(featureId)).lean().exec();
    };
}

