import { config } from '@/config.js';
import { authenticateMiddleware, authorizationMiddleware, UserRole, validateRequest, wrapController } from '@whats-down/shared';
import { Router } from 'express';
import { SystemEventController } from './controller.js';
import { getByTimeRequestSchema } from './validation.js';

export const systemEventRouter = Router();

systemEventRouter.get(
    '/',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER]),
    validateRequest(getByTimeRequestSchema),
    wrapController(SystemEventController.getByTime),
);
