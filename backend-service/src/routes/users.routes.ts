import { Router } from 'express';
import { forwardRequest } from '../proxy/proxy-handler';
import { authenticateMiddleware } from '../middleware/auth.middleware.js';
import { config } from '../config';

export const backendUsersRouter = Router();

const JWT_SECRET = config.jwt.secret;
const USERS_SERVICE_URL = config.services.usersServiceUrl;

backendUsersRouter.post('/api/users', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-services`,
    });
});

backendUsersRouter.post('/api/users/auth/refresh', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-services/auth/refresh`,
        cookieRewritePath: '/api/users/auth/refresh',
    });
});

backendUsersRouter.post('/api/users/login', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-services/login`,
    });
});

backendUsersRouter.post('/api/users/login/google', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-services/login/google`,
    });
});

backendUsersRouter.delete('/api/users/:id', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-services/${req.params.id}`,
    });
});

backendUsersRouter.patch('/api/users/:id/role', authenticateMiddleware(config.jwt.secret), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-services/${req.params.id}/role`,
    });
});

backendUsersRouter.post('/api/users/logout', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-services/logout`,
    });
});
