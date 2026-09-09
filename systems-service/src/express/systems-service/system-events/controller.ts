import { TypedRequest } from '@whats-down/shared';
import { Response } from 'express';
import { SystemEventManager } from './manager.js';
import { getByTimeRequestSchema } from './validation.js';

export class SystemEventController {
    static getByTime = async (req: TypedRequest<typeof getByTimeRequestSchema>, res: Response) => {
        res.json(await SystemEventManager.getByTime(req.query));
    };
}
