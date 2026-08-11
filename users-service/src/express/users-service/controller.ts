import { DocumentNotFoundError, InvalidOrExpiredTokenError } from '@/utils/errors.js';
import { clearAuthCookies, setAuthCookie, setRefreshCookie } from '@/utils/express/cookie.js';
import { InternalServerError, TypedRequest } from '@whats-down/shared';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UsersServiceManager } from './manager.js';
import { createInitialRefreshToken, rotateRefreshToken } from './refresh-token/manager.js';
import {
    changeUserRoleRequestSchema,
    createOneRequestSchema,
    deleteOneRequestSchema,
    getMeRequestSchema,
    googleAuthRequestSchema,
    loginRequestSchema,
    logoutRequestSchema,
} from './validations.js';
import { config } from '@/config.js';
import { refreshRequestSchema } from './refresh-token/validation.js';

export class UsersServiceController {
    static getMe = async (req: TypedRequest<typeof getMeRequestSchema>, res: Response) => {
        if (!req.user) {
            throw new InternalServerError();
        }

        res.json(await UsersServiceManager.getMe(req.user.userId));
    };

    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        res.json(await UsersServiceManager.createLocalUser({ ...req.body }));
    };

    static login = async (req: TypedRequest<typeof loginRequestSchema>, res: Response) => {
        const { user, token } = await UsersServiceManager.loginLocalUser(req.body.username, req.body.password);
        setAuthCookie(res, token);

        const { rawToken } = await createInitialRefreshToken(user._id.toString(), user.username);
        setRefreshCookie(res, rawToken);

        res.json(user);
    };

    static loginWithGoogle = async (req: TypedRequest<typeof googleAuthRequestSchema>, res: Response) => {
        const { user, token } = await UsersServiceManager.loginWithGoogle(req.body.idToken);
        setAuthCookie(res, token);

        const { rawToken } = await createInitialRefreshToken(user._id.toString(), user.username);
        setRefreshCookie(res, rawToken);

        res.json(user);
    };

    static refresh = async (req: TypedRequest<typeof refreshRequestSchema>, res: Response) => {
        const rawRefreshToken = req.cookies?.[config.refreshToken.cookieName];

        if (!rawRefreshToken) {
            throw new InvalidOrExpiredTokenError();
        }

        const { rawToken: newRawToken, record } = await rotateRefreshToken(rawRefreshToken);

        let nextAccessToken: string;

        try {
            nextAccessToken = await UsersServiceManager.generateTokenForUserId(record.userId.toString());
        } catch (err) {
            if (err instanceof DocumentNotFoundError) {
                throw new InvalidOrExpiredTokenError();
            }
            throw err;
        }

        setAuthCookie(res, nextAccessToken);
        setRefreshCookie(res, newRawToken);

        res.status(StatusCodes.OK).json({ success: true });
    };

    static changeUserRole = async (req: TypedRequest<typeof changeUserRoleRequestSchema>, res: Response) => {
        const { role } = req.body;
        const updatedUser = await UsersServiceManager.changeUserRole(req.params.id, role, req.user!.userId);
        res.json(updatedUser);
    };

    static deleteOne = async (req: TypedRequest<typeof deleteOneRequestSchema>, res: Response) => {
        res.json(await UsersServiceManager.deleteUser(req.params.id));
    };

    static logout = async (_req: TypedRequest<typeof logoutRequestSchema>, res: Response) => {
        clearAuthCookies(res);
        res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
    };
}
