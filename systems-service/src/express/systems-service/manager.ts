import { config } from '@/config.js';
import { DocumentNotFoundError, SystemWithChildrenError } from '@/utils/errors.js';
import { SystemStatus, SystemStatusPriority } from '@whats-down/shared';
import mongoose from 'mongoose';
import { CreateSystemPayload, System, SystemDocument } from './interface.js';
import { SystemModel } from './model.js';

export class SystemServiceManager {
    static getByQuery = async (query: Partial<System>, step: number, limit?: number): Promise<SystemDocument[]> => {
        return SystemModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .sort('statusPriority name')
            .lean()
            .exec();
    };

    static getCount = async (query: Partial<System>): Promise<number> => {
        return SystemModel.countDocuments(query).exec();
    };

    static getById = async (id: string): Promise<SystemDocument> => {
        return SystemModel.findById(id).orFail(new DocumentNotFoundError(id)).lean().exec();
    };

    static getRoots = async (step: number, limit?: number): Promise<SystemDocument[]> => {
        return SystemModel.find({ parentId: null }, {}, limit ? { limit, skip: limit * step } : {})
            .sort('statusPriority name')
            .lean()
            .exec();
    };

    static getAncestors = async (id: string): Promise<SystemDocument[]> => {
        const result = await SystemModel.aggregate([
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
                    maxDepth: 20,
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
        const result = await SystemModel.aggregate([
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
        const newSystem = await SystemModel.create({
            ...createSystemPayload,
            createdBy,
            createdByUsername,
        });

        await this.updateAncestorsStatus(newSystem.parentId ? newSystem.parentId.toString() : null, newSystem.status);
        await SystemModel.findByIdAndUpdate(newSystem.parentId, { $set: { hasChildren: true } })
            .lean()
            .exec();

        return newSystem;
    };

    static deleteOne = async (id: string): Promise<SystemDocument> => {
        const descendantIds = await this.getDescendantIds(id);

        const deletedSystem = await SystemModel.findByIdAndDelete(id).orFail(new DocumentNotFoundError(id)).lean().exec();

        if (descendantIds.length > 0) {
            await SystemModel.deleteMany({ _id: { $in: descendantIds } }).exec();
        }

        await this.updateAncestorsStatus(deletedSystem.parentId ? deletedSystem.parentId.toString() : null, SystemStatus.UP);
        await this.updateParentHasChildren(deletedSystem.parentId ? deletedSystem.parentId.toString() : null);

        return deletedSystem;
    };

    static renameSystem = async (id: string, name: string) => {
        return await SystemModel.findByIdAndUpdate(id, { name }, { new: true }).orFail(new DocumentNotFoundError(id)).lean().exec();
    };

    static changeStatus = async (id: string, status: SystemStatus): Promise<SystemDocument> => {
        if (await this.hasKids(id)) {
            throw new SystemWithChildrenError(id);
        }

        const result = await SystemModel.findByIdAndUpdate(id, { $set: buildStatusUpdate(status) }, { new: true })
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

        await SystemModel.findByIdAndUpdate(parentId, { $set: { hasChildren } }).lean().exec();
    };

    static updateAncestorsStatus = async (parentId: string | null, childStatus: SystemStatus): Promise<void> => {
        if (!parentId) {
            return;
        }

        const parentSystem = await SystemModel.findById(parentId).lean().exec();
        if (!parentSystem) {
            return;
        }

        const higherAncestors = await this.getAncestors(parentId);
        const ancestors = [parentSystem, ...higherAncestors];

        let currentStatus = childStatus;

        for (const ancestor of ancestors) {
            let newStatus: SystemStatus;
            if (currentStatus === SystemStatus.DOWN) {
                newStatus = SystemStatus.DOWN;
            } else {
                newStatus = (await this.hasKids(ancestor._id.toString(), SystemStatus.DOWN)) ? SystemStatus.DOWN : SystemStatus.UP;
            }

            if (newStatus === ancestor.status) {
                return;
            }

            await SystemModel.findByIdAndUpdate(ancestor._id, { $set: buildStatusUpdate(newStatus) })
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
}

const buildStatusUpdate = (status: SystemStatus) => ({
    status,
    statusPriority: SystemStatusPriority[status],
    statusUpdatedAt: Date.now(),
});
