import { Router } from 'express';
import { config } from '../config';
import { forwardRequest } from '../proxy/proxy-handler';
import { authenticateMiddleware } from '../middleware/auth.middleware.js';

export const backendSystemsRouter = Router();

const JWT_SECRET = config.jwt.secret;
const SYSTEMS_SERVICE_URL = config.services.systemsServiceUrl;

backendSystemsRouter.get('/api/systems', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services`,
    });
});

backendSystemsRouter.get('/api/systems/count', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services/count`,
    });
});

backendSystemsRouter.get('/api/systems/roots', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services/roots`,
    });
});
backendSystemsRouter.get('/api/systems/:id', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services/${req.params.id}`,
    });
});

backendSystemsRouter.post('/api/systems', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services`,
    });
});
backendSystemsRouter.put('/api/systems/:id', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services/${req.params.id}`,
    });
});
backendSystemsRouter.patch('/api/systems/:id/status', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services/${req.params.id}/status`,
    });
});

backendSystemsRouter.delete('/api/systems/:id', authenticateMiddleware(JWT_SECRET), (req, res) => {
    forwardRequest(req, res, {
        targetUrl: `${SYSTEMS_SERVICE_URL}/api/system-services/${req.params.id}`,
    });
});
