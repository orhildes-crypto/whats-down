import { config } from '@/config.js';
import { authenticateMiddleware } from '@whats-down/shared';
import { Router } from 'express';
import { createServiceProxy } from '../proxy/handler.js';

export const systemsRouter = Router({ mergeParams: true });

const SYSTEM_SERVICE_BASE_URL = `${config.services.systemsServiceUrl}${config.services.systemsServiceRoute}`;

const systemsServiceProxy = createServiceProxy(SYSTEM_SERVICE_BASE_URL);

systemsRouter.use(authenticateMiddleware(config.jwt.secret));

systemsRouter.all('*', systemsServiceProxy);