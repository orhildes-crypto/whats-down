import { Response } from 'express';
import { SystemServiceManager } from './manager.js';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    getCountRequestSchema,
    editServiceRequestSchema,
    changeStatusRequestSchema,
    getRootsByQueryRequestSchema,
    getAncestorsByIdRequestSchema,
} from './validations.js';
import { DeveloperError, TypedRequest } from '@whats-down/shared';


export class SystemServiceController {
    static getByQuery = async (req: TypedRequest<typeof getByQueryRequestSchema>, res: Response) => {
        const { step, limit, ...query } = req.query;

        res.json(await SystemServiceManager.getByQuery(query, step, limit));
    };

    static getRoots = async (req: TypedRequest<typeof getRootsByQueryRequestSchema>, res: Response) => {
        const { step, limit } = req.query;

        res.json(await SystemServiceManager.getRoots(step, limit));
    };

    static getCount = async (req: TypedRequest<typeof getCountRequestSchema>, res: Response) => {
        res.json(await SystemServiceManager.getCount(req.query));
    };

    static getById = async (req: TypedRequest<typeof getByIdRequestSchema>, res: Response) => {
        res.json(await SystemServiceManager.getById(req.params.id));
    };

    static getAncestors = async (req: TypedRequest<typeof getAncestorsByIdRequestSchema>, res: Response) => {
        res.json(await SystemServiceManager.getAncestors(req.params.id));
    };

    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        if (!req.user) {
            throw new DeveloperError("User context is missing. Make sure authenticateMiddleware is applied to this route.");
        }

        const { userId, username } = req.user;
        
        res.json(await SystemServiceManager.createOne(req.body, userId, username));
    };

    static renameSystem = async (req: TypedRequest<typeof editServiceRequestSchema>, res: Response) => {
        res.json(await SystemServiceManager.renameSystem(req.params.id, req.body.name));
    };

    static changeStatus = async (req: TypedRequest<typeof changeStatusRequestSchema>, res: Response) => {
        res.json(await SystemServiceManager.changeStatus(req.params.id, req.body.status));
    };

    static deleteOne = async (req: TypedRequest<typeof deleteOneRequestSchema>, res: Response) => {
        res.json(await SystemServiceManager.deleteOne(req.params.id));
    };
}
