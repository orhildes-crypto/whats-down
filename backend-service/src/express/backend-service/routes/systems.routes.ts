import { Router } from 'express';
import { config } from '../config';
import { forwardRequest } from '../proxy/proxy-handler';
import { authenticateMiddleware } from '../middleware/auth.middleware';

export const backendSystemsRouter = Router();

const JWT_SECRET = config.jwt.secret;
const SYSTEMS_SERVICE_URL = config.services.systemsServiceUrl;

backendSystemsRouter.get('/', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services`,
    });
});

backendSystemsRouter.get('/count', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services/count`,
    });
});

backendSystemsRouter.get('/roots', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services/roots`,
    });
});
backendSystemsRouter.get('/:id', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services/${req.params.id}`,
    });
});

backendSystemsRouter.post('/', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services`,
    });
});
backendSystemsRouter.put('/:id', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services/${req.params.id}`,
    });
});
backendSystemsRouter.patch('/:id/status', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services/${req.params.id}/status`,
    });
});

backendSystemsRouter.delete('/:id', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services/${req.params.id}`,
    });
});
