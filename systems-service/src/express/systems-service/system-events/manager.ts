import { SystemEventDocument, SystemEventsFilters } from '@whats-down/shared';
import { SystemEventModel } from './model.js';

export class SystemEventManager {
    static getByTime = async (query: SystemEventsFilters): Promise<SystemEventDocument[]> => {
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
