import mongoose from 'mongoose';
import { DocumentNotFoundError, SystemWithChildrenError } from '../../utils/errors.js';
import { CreateSystemPayload, SystemDocument, System, SystemCubeDTO } from './interface.js';
import { SystemServiceModel } from './model.js';
import { SystemStatus } from '../../../../shared/dist/interfaces/systemInterfaces.js';
import { config } from '../../config.js';

export class SystemServiceManager {
    static getByQuery = async (query: Partial<System>, step: number, limit?: number): Promise<SystemCubeDTO[]> => {
        const matchStage = toObjectIdQuery(query, SystemServiceModel);

        const pipeline: mongoose.PipelineStage[] = [{ $match: matchStage }, { $sort: { status: 1, name: 1 } }];
        if (limit) {
            pipeline.push({ $skip: limit * step }, { $limit: limit });
        }

        pipeline.push(
            {
                $lookup: {
                    from: config.mongo.systemServiceCollectionName,
                    localField: '_id',
                    foreignField: 'parentId',
                    as: 'children',
                },
            },
            {
                $addFields: {
                    hasChildren: { $gt: [{ $size: '$children' }, 0] },
                },
            },
            {
                $project: {
                    children: 0,
                },
            },
        );

        return SystemServiceModel.aggregate<SystemCubeDTO>(pipeline).exec();
    };

    static getCount = async (query: Partial<System>): Promise<number> => {
        return SystemServiceModel.countDocuments(query).exec();
    };

    static getById = async (id: string): Promise<SystemCubeDTO> => {
        const system = await SystemServiceModel.findById(id).orFail(new DocumentNotFoundError(id)).lean().exec();

        return { ...system, hasChildren: await this.checkForKids(system._id.toString()) };
    };

    static getRoots = async (step: number, limit?: number): Promise<SystemCubeDTO[]> => {
        const pipeline: mongoose.PipelineStage[] = [{ $match: { parentId: null } }, { $sort: { status: 1, name: 1 } }];

        if (limit) {
            pipeline.push({ $skip: limit * step }, { $limit: limit });
        }

        pipeline.push(
            {
                $lookup: {
                    from: config.mongo.systemServiceCollectionName,
                    localField: '_id',
                    foreignField: 'parentId',
                    as: 'children',
                },
            },
            {
                $addFields: {
                    hasChildren: { $gt: [{ $size: '$children' }, 0] },
                },
            },
            {
                $project: {
                    children: 0,
                },
            },
        );

        const res = await SystemServiceModel.aggregate<SystemCubeDTO>(pipeline).exec();

        console.log('getRoots res:', res);
        console.log(config.mongo.systemServiceCollectionName);

        return res;
    };

    static getAncestors = async (id: string): Promise<SystemDocument[]> => {
        const result = await SystemServiceModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) },
            },
            {
                $graphLookup: {
                    from: config.mongo.systemServiceCollectionName,
                    startWith: '$parentId',
                    connectFromField: 'parentId',
                    connectToField: '_id',
                    as: 'ancestors',
                    maxDepth: 10,
                    depthField: 'distance',
                },
            },
            {
                $addFields: {
                    ancestors: {
                        $sortArray: {
                            input: '$ancestors',
                            sortBy: { distance: 1 },
                        },
                    },
                },
            },
        ]);

        if (!result[0]) {
            throw new DocumentNotFoundError(id);
        }

        const ancestors = result[0].ancestors;

        return ancestors;
    };

    static createOne = async (createSystemPayload: CreateSystemPayload, createdBy: string, createdByUsername: string): Promise<SystemDocument> => {
        const newSystem = await SystemServiceModel.create({
            createdBy: createdBy,
            name: createSystemPayload.name,
            parentId: createSystemPayload.parentId,
            createdByUsername: createdByUsername,
        });

        await this.updateParentsStatus(newSystem.id, SystemStatus.UP);

        return newSystem;
    };

    static deleteOne = async (id: string): Promise<SystemDocument> => {
        if (await this.checkForKids(id)) {
            throw new SystemWithChildrenError(id);
        }

        const deletedSystem = await SystemServiceModel.findByIdAndDelete(id).orFail(new DocumentNotFoundError(id)).lean().exec();

        await this.updateParentsStatus(id, SystemStatus.UP);

        return deletedSystem;
    };

    static renameService = async (id: string, newName: string) => {
        return await SystemServiceModel.findByIdAndUpdate(id, { name: newName }, { new: true }).orFail(new DocumentNotFoundError(id)).lean().exec();
    };

    static changeStatus = async (id: string, status: SystemStatus): Promise<SystemDocument> => {
        if (await this.checkForKids(id)) {
            throw new SystemWithChildrenError(id);
        }

        const result = await SystemServiceModel.findByIdAndUpdate(id, { $set: { status: status, statusUpdatedAt: Date.now() } }, { new: true })
            .orFail(new DocumentNotFoundError(id))
            .lean()
            .exec();

        await this.updateParentsStatus(id, status);

        return result;
    };

    static updateParentsStatus = async (id: string, status: SystemStatus): Promise<void> => {
        const childSystem = await SystemServiceModel.findById(id).lean().exec();

        if (!childSystem?.parentId) {
            return;
        }

        const parentSystem = await SystemServiceModel.findById(childSystem.parentId).lean().exec();

        let newParentStatus: SystemStatus;
        if (status === SystemStatus.DOWN) {
            newParentStatus = SystemStatus.DOWN;
        } else {
            const hasDownSibling = await this.checkForDownKids(childSystem.parentId);
            hasDownSibling ? (newParentStatus = SystemStatus.DOWN) : (newParentStatus = SystemStatus.UP);
        }

        if (newParentStatus === parentSystem?.status) {
            return;
        }

        await SystemServiceModel.findByIdAndUpdate(
            childSystem.parentId,
            { $set: { status: newParentStatus, statusUpdatedAt: Date.now() } },
            { new: true },
        )
            .lean()
            .exec();

        await this.updateParentsStatus(childSystem.parentId, newParentStatus);
    };

    static checkForDownKids = async (parentId: string): Promise<boolean> => {
        const result = await SystemServiceModel.exists({
            parentId: parentId,
            status: 'DOWN',
        }).exec();

        return result ? true : false;
    };

    static checkForCycles = async (systemId: string, parentId: string): Promise<boolean> => {
        const result = await SystemServiceModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(parentId) },
            },
            {
                $graphLookup: {
                    from: 'systems-services',
                    startWith: '$_id',
                    connectFromField: 'parentId',
                    connectToField: '_id',
                    as: 'parents',
                    maxDepth: 10,
                },
            },
        ]);

        if (result.length === 0) {
            return false; // if the id does not exist
        }

        const parents = result[0].parents; // only one object matches

        return parents.some((parent: SystemDocument) => new mongoose.Types.ObjectId(parent._id).equals(systemId));
    };

    static checkForKids = async (id: string): Promise<boolean> => {
        const result = await SystemServiceModel.exists({
            parentId: id,
        }).exec();

        return result ? true : false;
    };
}

const toObjectIdQuery = <T extends object>(query: T, model: mongoose.Model<any>): Record<string, any> => {
    const parsedQuery: Record<string, any> = {};

    for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) continue;

        const schemaPath = model.schema.path(key);
        const isObjectIdField = schemaPath?.instance === 'ObjectId';

        if (isObjectIdField && typeof value === 'string') {
            parsedQuery[key] = new mongoose.Types.ObjectId(value);
        } else {
            parsedQuery[key] = value;
        }
    }

    return parsedQuery;
};
