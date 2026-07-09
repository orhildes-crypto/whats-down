import { DocumentNotFoundError } from '../../utils/errors.js';
import { Feature, FeatureDocument } from './interface.js';
import { FeaturesModel } from './model.js';

export class FeaturesManager {
    static getByQuery = async (query: Partial<Feature>, step: number, limit?: number): Promise<FeatureDocument[]> => {
        return FeaturesModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .lean()
            .exec();
    };

    static getCount = async (query: Partial<Feature>): Promise<number> => {
        return FeaturesModel.countDocuments(query).lean().exec();
    };

    static getById = async (featureId: string): Promise<FeatureDocument> => {
        return FeaturesModel.findById(featureId).orFail(new DocumentNotFoundError(featureId)).lean().exec();
    };

    static createOne = async (feature: Feature): Promise<FeatureDocument> => {
        return FeaturesModel.create(feature);
    };

    static updateOne = async (featureId: string, update: Partial<Feature>): Promise<FeatureDocument> => {
        return FeaturesModel.findByIdAndUpdate(featureId, update, { new: true }).orFail(new DocumentNotFoundError(featureId)).lean().exec();
    };

    static deleteOne = async (featureId: string): Promise<FeatureDocument> => {
        return FeaturesModel.findByIdAndDelete(featureId).orFail(new DocumentNotFoundError(featureId)).lean().exec();
    };
}
