import { Response } from 'express';
import { TypedRequest } from '@whats-down/shared';
import { UsersServiceManager } from './manager.js';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    loginRequestSchema, 
    googleAuthRequestSchema,
} from './validations.js';
import { setAuthCookie } from '../../utils/express/cookie.js';

export class UsersServiceController {
    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        res.json(await UsersServiceManager.createLocalUser({ ...req.body }));
    };

    static login = async (req: TypedRequest<typeof loginRequestSchema>, res: Response) => {
        const { user, token } = await UsersServiceManager.loginLocalUser(req.body.username, req.body.password);
        setAuthCookie(res, token);
        res.json({ user });
    };

    static loginWithGoogle = async (req: TypedRequest<typeof googleAuthRequestSchema>, res: Response) => {
        const { user, token } = await UsersServiceManager.loginWithGoogle(req.body.idToken);
        setAuthCookie(res, token);
        res.json({ user });
    };

    static deleteOne = async (req: TypedRequest<typeof deleteOneRequestSchema>, res: Response) => {
        res.json(await UsersServiceManager.deleteUser(req.params.id));
    };
}
