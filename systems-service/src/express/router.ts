import { Router } from 'express';
import { systemRouter } from './systems-service/router.js';
import { StatusCodes } from 'http-status-codes';
import { systemEventRouter } from './systems-service/system-events/router.js';

export const appRouter = Router();

appRouter.use('/api/systems/events', systemEventRouter);
appRouter.use('/api/systems', systemRouter);

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(StatusCodes.OK).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(StatusCodes.NOT_FOUND).send('Invalid Route');
});
