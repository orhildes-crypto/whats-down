import { Router } from 'express';
import { forwardRequest } from '../proxy/proxy-handler';
import { authenticateMiddleware } from '../middleware/auth.middleware';
import { config } from '../config';

export const backendUsersRouter = Router();

const JWT_SECRET = config.jwt.secret;
const USERS_SERVICE_URL = config.services.usersServiceUrl;

backendUsersRouter.post('/', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-services`,
    });
});

backendUsersRouter.post('/auth/refresh', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-services/auth/refresh`,
        cookieRewritePath: '/api/users/auth/refresh',
    });
});

backendUsersRouter.post('/login', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-services/login`,
    });
});

backendUsersRouter.post('/login/google', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-services/login/google`,
    });
});

backendUsersRouter.delete('/:id', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-services/${req.params.id}`,
    });
});

backendUsersRouter.patch('/:id/role', authenticateMiddleware(config.jwt.secret), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-services/${req.params.id}/role`,
    });
});

backendUsersRouter.post('/logout', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-services/logout`,
    });
});
