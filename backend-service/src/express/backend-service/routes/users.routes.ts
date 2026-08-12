import { config } from '@/config.js';
import { authenticateMiddleware } from '@whats-down/shared';
import { Request, Response, Router } from 'express';
import { forwardRequest } from '../proxy/proxy-handler.js';

export const backendUsersRouter = Router({ mergeParams: true });

const USERS_SERVICE_BASE_URL = `${config.services.usersServiceUrl}/api/users-service`;

const forwardToUsersService = (req: Request, res: Response) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_BASE_URL}${req.url}`,
        cookieRewritePath: config.proxy.publicRefreshPath,
    });
};

backendUsersRouter.delete('/:id', authenticateMiddleware(config.jwt.secret), (req, res) => {
    forwardToUsersService(req, res);
});

backendUsersRouter.put('/:id/role', authenticateMiddleware(config.jwt.secret), (req, res) => {
    forwardToUsersService(req, res);
});

backendUsersRouter.all('*', (req, res) => {
    forwardToUsersService(req, res);
});
