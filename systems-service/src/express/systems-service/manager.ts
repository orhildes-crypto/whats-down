import { config } from '@/config.js';
import { DocumentNotFoundError, SystemWithChildrenError } from '@/utils/errors.js';
import { SystemStatus, SystemStatusPriority } from '@whats-down/shared';
import mongoose from 'mongoose';
import { CreateSystemPayload, System, SystemCubeDTO, SystemDocument } from './interface.js';
import { SystemServiceModel } from './model.js';

export class SystemServiceManager {
    static getByQuery = async (query: Partial<System>, step: number, limit?: number): Promise<SystemCubeDTO[]> => {
        return SystemServiceModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .sort('statusPriority name')
            .lean()
            .exec();
    };

    static getCount = async (query: Partial<System>): Promise<number> => {
        return SystemServiceModel.countDocuments(query).exec();
    };

    static getById = async (id: string): Promise<SystemCubeDTO> => {
        return SystemServiceModel.findById(id).orFail(new DocumentNotFoundError(id)).lean().exec();
    };

    static getRoots = async (step: number, limit?: number): Promise<SystemCubeDTO[]> => {
        return SystemServiceModel.find({ parentId: null }, {}, limit ? { limit, skip: limit * step } : {})
            .sort('statusPriority name')
            .lean()
            .exec();
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

        await this.updateAncestorsStatus(newSystem.parentId ? newSystem.parentId.toString() : null, newSystem.status);
        await SystemServiceModel.findByIdAndUpdate(newSystem.parentId, { $set: { hasChildren: true } })
            .lean()
            .exec();

        return newSystem;
    };

    static deleteOne = async (id: string): Promise<SystemDocument> => {
        const descendantIds = await this.getDescendantIds(id);

        const deletedSystem = await SystemServiceModel.findByIdAndDelete(id).orFail(new DocumentNotFoundError(id)).lean().exec();

        if (descendantIds.length > 0) {
            await SystemServiceModel.deleteMany({ _id: { $in: descendantIds } }).exec();
        }

        await this.updateAncestorsStatus(deletedSystem.parentId ? deletedSystem.parentId.toString() : null, SystemStatus.UP);
        await this.updateParentHasChildren(deletedSystem.parentId ? deletedSystem.parentId.toString() : null);

        return deletedSystem;
    };

    static renameSystem = async (id: string, name: string) => {
        return await SystemServiceModel.findByIdAndUpdate(id, { name }, { new: true }).orFail(new DocumentNotFoundError(id)).lean().exec();
    };

    static changeStatus = async (id: string, status: SystemStatus): Promise<SystemDocument> => {
        if (await this.hasKids(id)) {
            throw new SystemWithChildrenError(id);
        }

        const result = await SystemServiceModel.findByIdAndUpdate(id, { $set: buildStatusUpdate(status) }, { new: true })
            .orFail(new DocumentNotFoundError(id))
            .lean()
            .exec();

        await this.updateAncestorsStatus(result.parentId ? result.parentId.toString() : null, status);

        return result;
    };

    static updateParentHasChildren = async (parentId: string | null): Promise<void> => {
        if (!parentId) {
            return;
        }

        const hasChildren = await this.hasKids(parentId);

        await SystemServiceModel.findByIdAndUpdate(parentId, { $set: { hasChildren } }).lean().exec();
    };

    static updateAncestorsStatus = async (parentId: string | null, childStatus: SystemStatus): Promise<void> => {
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
            newParentStatus = (await this.hasKids(parentId, SystemStatus.DOWN)) ? SystemStatus.DOWN : SystemStatus.UP;
        }

        if (newParentStatus === parentSystem.status) {
            return;
        }

        await SystemServiceModel.findByIdAndUpdate(parentId, { $set: buildStatusUpdate(newParentStatus) }, { new: true })
            .lean()
            .exec();

        this.updateAncestorsStatus(parentSystem.parentId ? parentSystem.parentId.toString() : null, newParentStatus);
    };

    static hasKids = async (parentId: string, status?: SystemStatus): Promise<boolean> => {
        const result = await SystemServiceModel.exists({
            parentId,
            ...(status && { status }),
        }).exec();

        return !!result;
    };
}


const buildStatusUpdate = (status: SystemStatus) => ({
    status,
    statusPriority: SystemStatusPriority[status],
    statusUpdatedAt: Date.now(),
});
