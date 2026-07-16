import { Response } from 'express';
import { TypedRequest } from '@whats-down/shared';
import { UsersServiceManager } from './manager.js';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    loginRequestSchema,
    googleAuthRequestSchema,
    changeUserRoleRequestSchema,
    logoutRequestSchema,
} from './validations.js';
import { setAuthCookie, clearAuthCookie, REFRESH_COOKIE_NAME, setRefreshCookie } from '../../utils/express/cookie.js';
import { createInitialRefreshToken, rotateRefreshToken } from './refresh-token/manager.js';
import { InvalidOrExpiredTokenError, ReuseTokenAttackDetected } from '../../utils/errors.js';

export class UsersServiceController {
    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        res.json(await UsersServiceManager.createLocalUser({ ...req.body }));
    };

    static login = async (req: TypedRequest<typeof loginRequestSchema>, res: Response) => {
        const { user, token } = await UsersServiceManager.loginLocalUser(req.body.username, req.body.password);
        setAuthCookie(res, token);

        const { rawToken } = await createInitialRefreshToken(user._id.toString());
        setRefreshCookie(res, rawToken);

        res.json({ user });
    };

    static loginWithGoogle = async (req: TypedRequest<typeof googleAuthRequestSchema>, res: Response) => {
        const { user, token } = await UsersServiceManager.loginWithGoogle(req.body.idToken);
        setAuthCookie(res, token);

        const { rawToken } = await createInitialRefreshToken(user._id.toString());
        setRefreshCookie(res, rawToken);

        res.json({ user });
    };

    static refresh = async (req: TypedRequest<any>, res: Response) => {
        const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

        if (!rawRefreshToken) {
            throw new InvalidOrExpiredTokenError();
        }

        const { rawToken: newRawToken, record } = await rotateRefreshToken(rawRefreshToken);

        const nextAccessToken = await UsersServiceManager.generateTokenForUserId(record.userId.toString());

        setAuthCookie(res, nextAccessToken);
        setRefreshCookie(res, newRawToken);

        res.status(200).json({ success: true });
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
        clearAuthCookie(res);
        res.status(200).json({ message: 'Logged out successfully' });
    };
}
