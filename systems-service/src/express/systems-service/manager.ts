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

        return await SystemServiceModel.aggregate<SystemCubeDTO>(pipeline).exec();
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

        if (!result[0]) throw new DocumentNotFoundError(id);

        return result[0].ancestors;
    };

    private static getDescendantIds = async (id: string): Promise<mongoose.Types.ObjectId[]> => {
        const result = await SystemServiceModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $graphLookup: {
                    from: config.mongo.systemServiceCollectionName,
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parentId',
                    as: 'descendants',
                },
            },
            { $project: { 'descendants._id': 1 } },
        ]).exec();

        return result[0]?.descendants.map((d: { _id: mongoose.Types.ObjectId }) => d._id) ?? [];
    };

    static createOne = async (createSystemPayload: CreateSystemPayload, createdBy: string, createdByUsername: string): Promise<SystemDocument> => {
        const newSystem = await SystemServiceModel.create({
            ...createSystemPayload,
            createdBy,
            createdByUsername,
        });

        await this.updateAncestorsStatus(newSystem.parentId?.toString(), newSystem.status);

        return newSystem;
    };

    static deleteOne = async (id: string): Promise<SystemDocument> => {
        const descendantIds = await this.getDescendantIds(id);

        const deletedSystem = await SystemServiceModel.findByIdAndDelete(id).orFail(new DocumentNotFoundError(id)).lean().exec();

        if (descendantIds.length > 0) {
            await SystemServiceModel.deleteMany({ _id: { $in: descendantIds } }).exec();
        }

        await this.updateAncestorsStatus(deletedSystem.parentId?.toString(), SystemStatus.UP);

        return deletedSystem;
    };

    static renameService = async (id: string, newName: string) => {
        return await SystemServiceModel.findByIdAndUpdate(id, { name: newName }, { new: true }).orFail(new DocumentNotFoundError(id)).lean().exec();
    };

    static changeStatus = async (id: string, status: SystemStatus): Promise<SystemDocument> => {
        if (await this.checkForKids(id)) {
            throw new SystemWithChildrenError(id);
        }

        const result = await SystemServiceModel.findByIdAndUpdate(id, { $set: { status, statusUpdatedAt: Date.now() } }, { new: true })
            .orFail(new DocumentNotFoundError(id))
            .lean()
            .exec();

        await this.updateAncestorsStatus(result.parentId?.toString(), status);

        return result;
    };

    static updateAncestorsStatus = async (parentId: string | null | undefined, childStatus: SystemStatus): Promise<void> => {
        if (!parentId) {
            return;
        }

        const parentSystem = await SystemServiceModel.findById(parentId).lean().exec();
        if (!parentSystem) {
            return;
        }

        let newParentStatus: SystemStatus;
        if (childStatus === SystemStatus.DOWN) {
            newParentStatus = SystemStatus.DOWN;
        } else {
            const hasDownSibling = await this.checkForDownKids(parentId);
            newParentStatus = hasDownSibling ? SystemStatus.DOWN : SystemStatus.UP;
        }

        if (newParentStatus === parentSystem.status) {
            return;
        }

        await SystemServiceModel.findByIdAndUpdate(parentId, { $set: { status: newParentStatus, statusUpdatedAt: Date.now() } }, { new: true })
            .lean()
            .exec();

        await this.updateAncestorsStatus(parentSystem.parentId?.toString(), newParentStatus);
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
