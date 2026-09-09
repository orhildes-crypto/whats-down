import { SystemEventDocument, SystemEventsFilters } from '@whats-down/shared';
import { SystemEventModel } from './model.js';
import { SystemModel } from '../model.js';
import { DocumentNotFoundError } from '@/utils/errors.js';

export class SystemEventManager {
    static getByTime = async (query: SystemEventsFilters): Promise<SystemEventDocument[]> => {
        if (!(await SystemModel.exists({ _id: query.systemId }))) {
            throw new DocumentNotFoundError(`System with id ${query.systemId} not found`);
        }

        const endDate = query.end === 'now' ? new Date() : new Date(query.end);

        return SystemEventModel.aggregate([
            {
                $match: {
                    systemId: query.systemId,
                    createdAt: {
                        $gte: new Date(query.start),
                        $lte: endDate,
                    },
                },
            },
            { $sort: { createdAt: 1 } },
        ]).exec();
    };
}
