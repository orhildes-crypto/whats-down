import mongoose from 'mongoose';
import { DocumentNotFoundError, SystemWithChildrenError } from '../../utils/errors.js';
import { CreateSystemPayload, SystemDocument, System, SystemCubeDTO } from './interface.js';
import { SystemServiceModel } from './model.js';
import { SystemStatus, SystemStatusPriority } from '../../../../shared/dist/interfaces/systemInterfaces.js';
import { config } from '../../config.js';

export class SystemServiceManager {
    static getByQuery = async (query: Partial<System>, step: number, limit?: number): Promise<SystemCubeDTO[]> => {
        const matchStage = toObjectIdQuery(query, SystemServiceModel);

        const pipeline: mongoose.PipelineStage[] = [{ $match: matchStage }, { $sort: { statusPriority: 1, name: 1 } }];
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
        const pipeline: mongoose.PipelineStage[] = [{ $match: { parentId: null } }, { $sort: { statusPriority: 1, name: 1 } }];

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
            statusPriority: SystemStatusPriority[SystemStatus.UP],
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

    static renameSystem = async (id: string, name: string) => {
        return await SystemServiceModel.findByIdAndUpdate(id, { name }, { new: true }).orFail(new DocumentNotFoundError(id)).lean().exec();
    };

    static changeStatus = async (id: string, status: SystemStatus): Promise<SystemDocument> => {
        if (await this.checkForKids(id)) {
            throw new SystemWithChildrenError(id);
        }

        const result = await SystemServiceModel.findByIdAndUpdate(id, { $set: buildStatusUpdate(status) }, { new: true })
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
            newParentStatus = (await this.checkForDownKids(parentId)) ? SystemStatus.DOWN : SystemStatus.UP;
        }

        if (newParentStatus === parentSystem.status) {
            return;
        }

        await SystemServiceModel.findByIdAndUpdate(parentId, { $set: buildStatusUpdate(newParentStatus) }, { new: true })
            .lean()
            .exec();

        this.updateAncestorsStatus(parentSystem.parentId?.toString(), newParentStatus);
    };

    static checkForDownKids = async (parentId: string): Promise<boolean> => {
        const result = await SystemServiceModel.exists({
            parentId: parentId,
            status: SystemStatus.DOWN,
        }).exec();

        return !!result;
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
            return false; 
        }

        const parents = result[0].parents;

        return parents.some((parent: SystemDocument) => parent._id.toString() === systemId.toString());
    };

    static checkForKids = async (parentId: string): Promise<boolean> => {
        const result = await SystemServiceModel.exists({
            parentId
        }).exec();

        return !!result;
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

const buildStatusUpdate = (status: SystemStatus) => ({
    status,
    statusPriority: SystemStatusPriority[status],
    statusUpdatedAt: Date.now(),
});
