import mongoose from 'mongoose';
import { DocumentNotFoundError, SystemWithChildrenError } from '../../utils/errors.js';
import { CreateSystemPayload, SystemDocument, System, SystemCubeDTO } from './interface.js';
import { SystemServiceModel } from './model.js';
import { SystemStatus } from '../../../../shared/dist/interfaces/systemInterfaces.js';

export class SystemServiceManager {
    static getByQuery = async (query: Partial<System>, step: number, limit?: number): Promise<SystemCubeDTO[]> => {
        const systems = await SystemServiceModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .sort('status name')
            .lean()
            .exec();

        return await Promise.all(
            systems.map(async (system) => ({
                ...system,
                hasChildren: await this.checkForKids(system._id.toString()),
            })),
        );
    };

    static getCount = async (query: Partial<System>): Promise<number> => {
        return await SystemServiceModel.countDocuments(query).exec();
    };

    static getById = async (systemId: string): Promise<SystemCubeDTO> => {
        const system = await SystemServiceModel.findById(systemId).orFail(new DocumentNotFoundError(systemId)).lean().exec();

        return { ...system, hasChildren: await this.checkForKids(system._id) };
    };

    static getRoots = async (step: number, limit?: number): Promise<SystemCubeDTO[]> => {
        const systems = await SystemServiceModel.find({ parentId: null }, {}, limit ? { limit, skip: limit * step } : {})
            .sort('status name')
            .lean()
            .exec();

        return await Promise.all(
            systems.map(async (system) => ({
                ...system,
                hasChildren: await this.checkForKids(system._id.toString()),
            })),
        );
    };

    static getAncestors = async (systemId: string): Promise<SystemDocument[]> => {
        const result = await SystemServiceModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(systemId) },
            },
            {
                $graphLookup: {
                    from: 'systems-services',
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
            throw new DocumentNotFoundError(systemId);
        }

        const ancestors = result[0].ancestors;

        return ancestors;
    };

    static createOne = async (
        createSystemPayload: CreateSystemPayload,
        createdBy: string,
        createdByUsername: string,
    ): Promise<SystemDocument> => {
        const newSystem = await SystemServiceModel.create({
            createdBy: createdBy,
            name: createSystemPayload.name,
            parentId: createSystemPayload.parentId,
            createdByUsername: createdByUsername,
        });

        await this.updateParentsStatus(newSystem.id, 'UP');

        return newSystem;
    };

    static deleteOne = async (systemId: string): Promise<SystemDocument> => {
        if (await this.checkForKids(systemId)) {
            throw new SystemWithChildrenError(systemId);
        }

        const deletedSystem = await SystemServiceModel.findByIdAndDelete(systemId).orFail(new DocumentNotFoundError(systemId)).lean().exec();

        await this.updateParentsStatus(systemId, 'UP');

        return deletedSystem;
    };

    static renameService = async (systemId: string, newName: string) => {
        return await SystemServiceModel.findByIdAndUpdate(systemId, { name: newName }, { new: true })
            .orFail(new DocumentNotFoundError(systemId))
            .lean()
            .exec();
    };

    static changeStatus = async (systemId: string, status: SystemStatus): Promise<SystemDocument> => {
        if (await this.checkForKids(systemId)) {
            throw new SystemWithChildrenError(systemId);
        }

        const result = await SystemServiceModel.findByIdAndUpdate(systemId, { $set: { status: status, statusUpdatedAt: Date.now() } }, { new: true })
            .orFail(new DocumentNotFoundError(systemId))
            .lean()
            .exec();

        await this.updateParentsStatus(systemId, status);

        return result;
    };

    static updateParentsStatus = async (systemId: string, status: 'UP' | 'DOWN'): Promise<void> => {
        const childSystem = await SystemServiceModel.findById(systemId).lean().exec();

        if (!childSystem?.parentId) {
            return;
        }

        const parentSystem = await SystemServiceModel.findById(childSystem.parentId).lean().exec();

        let newParentStatus: 'UP' | 'DOWN';
        if (status === 'DOWN') {
            newParentStatus = 'DOWN';
        } else {
            const hasDownSibling = await this.checkForDownKids(childSystem.parentId);
            hasDownSibling ? (newParentStatus = 'DOWN') : (newParentStatus = 'UP');
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

    static checkForKids = async (systemId: string): Promise<boolean> => {
        const result = await SystemServiceModel.exists({
            parentId: systemId,
        }).exec();

        return result ? true : false;
    };
}
