import { config } from '@/config.js';
import { authenticateMiddleware } from '@whats-down/shared';
import { createServiceProxy } from '../proxy/handler.js';
import { Router } from 'express';

export const usersRouter = Router({ mergeParams: true });

const USERS_SERVICE_BASE_URL = `${config.services.usersServiceUrl}${config.services.usersServiceRoute}`;

const usersServiceProxy = createServiceProxy(USERS_SERVICE_BASE_URL);

usersRouter.delete('/:id', authenticateMiddleware(config.jwt.secret), usersServiceProxy);
usersRouter.put('/:id/role', authenticateMiddleware(config.jwt.secret), usersServiceProxy);
usersRouter.all('*', usersServiceProxy);