import { Router } from 'express';
import { config } from '../../../config.js';
import { authenticateMiddleware } from '../middleware/auth.middleware.js';
import { forwardRequest } from '../proxy/proxy-handler.js';

export const backendUsersRouter = Router({ mergeParams: true });

const USERS_SERVICE_BASE_URL = `${config.services.usersServiceUrl}/api/users-service`;

const forwardToUsersService = (req: any, res: any) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_BASE_URL}${req.url}`,
        cookieRewritePath: config.auth.cookieRewritePath,
    });
};

backendUsersRouter.all('*', (req, res) => {
    forwardToUsersService(req, res);
});
backendUsersRouter.delete('/:id', authenticateMiddleware(config.jwt.secret), (req, res) => {
    forwardToUsersService(req, res);
});

backendUsersRouter.patch('/:id/role', authenticateMiddleware(config.jwt.secret), (req, res) => {
    forwardToUsersService(req, res);
});
