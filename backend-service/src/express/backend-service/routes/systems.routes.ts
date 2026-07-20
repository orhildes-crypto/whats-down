import { Router } from 'express';
import { config } from '../../../config.js';
import { forwardRequest } from '../proxy/proxy-handler.js';
import { authenticateMiddleware } from '../middleware/auth.middleware.js';

export const backendSystemsRouter = Router();

const JWT_SECRET = config.jwt.secret;
const SYSTEMS_SERVICE_URL = config.services.systemsServiceUrl;

backendSystemsRouter.get('/', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-service`,
    });
});

backendSystemsRouter.get('/count', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-service/count`,
    });
});

backendSystemsRouter.get('/roots', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-service/roots`,
    });
});
backendSystemsRouter.get('/:id', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-service/${req.params.id}`,
    });
});

backendSystemsRouter.post('/', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-service`,
    });
});
backendSystemsRouter.put('/:id', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-service/${req.params.id}`,
    });
});
backendSystemsRouter.patch('/:id/status', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-service/${req.params.id}/status`,
    });
});

backendSystemsRouter.delete('/:id', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-service/${req.params.id}`,
    });
});
