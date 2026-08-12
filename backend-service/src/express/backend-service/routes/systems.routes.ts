import { config } from '@/config.js';
import { Router } from 'express';
import { authenticateMiddleware } from '../middleware/auth.middleware.js';
import { forwardRequest } from '../proxy/proxy-handler.js';

export const backendSystemsRouter = Router({ mergeParams: true });

const SYSTEM_SERVICE_BASE_URL = `${config.services.systemsServiceUrl}/api/systems-service`;

backendSystemsRouter.use(authenticateMiddleware(config.jwt.secret));

backendSystemsRouter.all('*', (req, res) => {
    const targetUrl = `${SYSTEM_SERVICE_BASE_URL}${req.url}`;
    
    forwardRequest(req, res, { targetUrl });
});