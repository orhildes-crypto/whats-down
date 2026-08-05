import { Router } from 'express';
import { forwardRequest } from '../proxy/proxy-handler.js';
import { authenticateMiddleware } from '../middleware/auth.middleware.js';
import { config } from '../../../config.js';

export const backendUsersRouter = Router();

const JWT_SECRET = config.jwt.secret;
const USERS_SERVICE_URL = config.services.usersServiceUrl;
const COOKIE_REWRITE_PATH = '/api/users/auth/refresh';

backendUsersRouter.get('/me', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-service/me`,
    })
})

backendUsersRouter.post('/', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-service`,
    });
});

backendUsersRouter.post('/auth/refresh', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-service/auth/refresh`,
        cookieRewritePath: COOKIE_REWRITE_PATH,
    });
});

backendUsersRouter.post('/login', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-service/login`,
        cookieRewritePath: COOKIE_REWRITE_PATH,
    });
});

backendUsersRouter.post('/login/google', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-service/login/google`,
        cookieRewritePath: COOKIE_REWRITE_PATH,
    });
});

backendUsersRouter.delete('/:id', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-service/${req.params.id}`,
    });
});

backendUsersRouter.patch('/:id/role', authenticateMiddleware(config.jwt.secret), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-service/${req.params.id}/role`,
    });
});

backendUsersRouter.post('/logout', (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${USERS_SERVICE_URL}/api/users-service/logout`,
        cookieRewritePath: COOKIE_REWRITE_PATH,
    });
});
