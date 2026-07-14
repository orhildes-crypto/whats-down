import { Response } from 'express';
import { TypedRequest } from '@whats-down/shared';
import { UsersServiceManager } from './manager.js';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    loginRequestSchema, 
    googleAuthRequestSchema,
} from './validations.js';

export class UsersServiceController {
    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        res.json(await UsersServiceManager.createLocalUser({ ...req.body }));
    };

    static login = async (req: TypedRequest<typeof loginRequestSchema>, res: Response) => {
        res.json(await UsersServiceManager.loginLocalUser(req.body.username, req.body.password));
    };

    static loginWithGoogle = async (req: TypedRequest<typeof googleAuthRequestSchema>, res: Response) => {
        res.json(await UsersServiceManager.loginWithGoogle(req.body.idToken));
    };

    static deleteOne = async (req: TypedRequest<typeof deleteOneRequestSchema>, res: Response) => {
        res.json(await UsersServiceManager.deleteUser(req.params.id));
    };
}
