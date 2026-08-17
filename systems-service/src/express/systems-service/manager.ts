import { config } from '@/config.js';
import { DocumentNotFoundError, SystemWithChildrenError } from '@/utils/errors.js';
import { SystemFilters, SystemStatus, SystemStatusPriority } from '@whats-down/shared';
import mongoose from 'mongoose';
import { CreateSystemPayload, SystemDocument } from './interface.js';
import { SystemModel } from './model.js';

export class SystemServiceManager {
    static getByQuery = async (query: SystemFilters, step: number, limit?: number): Promise<SystemDocument[]> => {
        return SystemModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .sort(config.systems.defaultSort)
            .lean()
            .exec();
    };

    static getCount = async (query: SystemFilters): Promise<number> => {
        return SystemModel.countDocuments(query).exec();
    };

    static getById = async (id: string): Promise<SystemDocument> => {
        return SystemModel.findById(id).orFail(new DocumentNotFoundError(id)).lean().exec();
    };

    static getRoots = async (step: number, limit?: number): Promise<SystemDocument[]> => {
        return SystemModel.find({ parentId: null }, {}, limit ? { limit, skip: limit * step } : {})
            .sort(config.systems.defaultSort)
            .lean()
            .exec();
    };

    static getParentsOfSystem  = async (id: string): Promise<SystemDocument[]> => {
        const targetObjectId = this.toObjectId(id);

        const [targetSystem] = await SystemModel.aggregate([
            {
                $match: { _id: targetObjectId },
            },
            {
                $graphLookup: {
                    from: config.mongo.systemServiceCollectionName,
                    startWith: '$parentId',
                    connectFromField: 'parentId',
                    connectToField: '_id',
                    as: 'parents',
                    maxDepth: config.systems.maxParentsDepth,
                    depthField: 'distance',
                },
            },
            {
                $addFields: {
                    parents: {
                        $sortArray: {
                            input: '$parents',
                            sortBy: { distance: 1 },
                        },
                    },
                },
            },
        ]);

        if (!targetSystem) {
            throw new DocumentNotFoundError(id);
        }

        return targetSystem.parents ?? [];
    };

    private static getDescendantIds = async (id: string): Promise<mongoose.Types.ObjectId[]> => {
        const targetObjectId = this.toObjectId(id);

        const [rootDocument] = await SystemModel.aggregate<{ descendantIds: mongoose.Types.ObjectId[] }>([
            {
                $match: { _id: targetObjectId },
            },
            {
                $graphLookup: {
                    from: config.mongo.systemServiceCollectionName,
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parentId',
                    as: 'descendants',
                },
            },
            {
                $project: {
                    _id: 0,
                    descendantIds: {
                        $map: {
                            input: '$descendants',
                            as: 'descendant',
                            in: '$$descendant._id',
                        },
                    },
                },
            },
        ]).exec();

        return rootDocument?.descendantIds ?? [];
    };

    static createOne = async (createSystemPayload: CreateSystemPayload, createdBy: string, createdByUsername: string): Promise<SystemDocument> => {
        const newSystem = await SystemModel.create({
            ...createSystemPayload,
            createdBy,
            createdByUsername,
        });

        const tasks: Promise<unknown>[] = [this.updateParentsStatus(newSystem.parentId ? newSystem.parentId.toString() : null, newSystem.status)];

        if (newSystem.parentId) {
            tasks.push(
                SystemModel.findByIdAndUpdate(newSystem.parentId, { $set: { hasChildren: true } })
                    .lean()
                    .exec(),
            );
        }

        await Promise.all(tasks);

        return newSystem;
    };

    static deleteOne = async (id: string): Promise<SystemDocument> => {
        const descendantIds = await this.getDescendantIds(id);

        const deletedSystem = await SystemModel.findByIdAndDelete(id).orFail(new DocumentNotFoundError(id)).lean().exec();

        const parentIdStr = deletedSystem.parentId ? deletedSystem.parentId.toString() : null;

        const tasks: Promise<unknown>[] = [this.updateParentsStatus(parentIdStr, SystemStatus.UP), this.updateParentHasChildren(parentIdStr)];

        if (descendantIds.length > 0) {
            tasks.push(SystemModel.deleteMany({ _id: { $in: descendantIds } }).exec());
        }

        await Promise.all(tasks);

        return deletedSystem;
    };

    static renameSystem = async (id: string, name: string) => {
        return await SystemModel.findByIdAndUpdate(id, { name }, { new: true }).orFail(new DocumentNotFoundError(id)).lean().exec();
    };

    static changeStatus = async (id: string, status: SystemStatus): Promise<SystemDocument> => {
        const system = await SystemModel.findById(id).orFail(new DocumentNotFoundError(id)).exec();

        if (system.hasChildren) {
            throw new SystemWithChildrenError(id);
        }

        system.set(buildStatusUpdate(status));
        const updated = await system.save();

        await this.updateParentsStatus(updated.parentId ? updated.parentId.toString() : null, status);

        return updated.toObject();
    };

    static updateParentHasChildren = async (parentId: string | null): Promise<void> => {
        if (!parentId) {
            return;
        }

        const hasChildren = await this.hasKids(parentId);

        await SystemModel.findByIdAndUpdate(parentId, { $set: { hasChildren } }).lean().exec();
    };

    static updateParentsStatus = async (parentId: string | null, childStatus: SystemStatus): Promise<void> => {
        if (!parentId) {
            return;
        }

        const parentSystem = await SystemModel.findById(parentId).lean().exec();
        if (!parentSystem) {
            return;
        }

        const higherParents = await this.getParentsOfSystem(parentId);
        const parents = [parentSystem, ...higherParents];

        let currentStatus = childStatus;

        for (const parent of parents) {
            let newStatus: SystemStatus;
            if (currentStatus === SystemStatus.DOWN) {
                newStatus = SystemStatus.DOWN;
            } else {
                newStatus = (await this.hasKids(parent._id.toString(), SystemStatus.DOWN)) ? SystemStatus.DOWN : SystemStatus.UP;
            }

            if (newStatus === parent.status) {
                return;
            }

            await SystemModel.findByIdAndUpdate(parent._id, { $set: buildStatusUpdate(newStatus) })
                .lean()
                .exec();

            currentStatus = newStatus;
        }
    };

    static hasKids = async (parentId: string, status?: SystemStatus): Promise<boolean> => {
        const result = await SystemModel.exists({
            parentId,
            ...(status && { status }),
        }).exec();

        return !!result;
    };

    private static toObjectId = (id: string): mongoose.Types.ObjectId => {
        return new mongoose.Types.ObjectId(id);
    };
}

const buildStatusUpdate = (status: SystemStatus) => ({
    status,
    statusPriority: SystemStatusPriority[status],
    statusUpdatedAt: Date.now(),
});
