import { Router } from 'express';
import { systemServiceRouter } from './system-service/router.js';
import { StatusCodes } from 'http-status-codes';

export const appRouter = Router();

appRouter.use('/api/system-service', systemServiceRouter);

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(StatusCodes.OK).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(StatusCodes.NOT_FOUND).send('Invalid Route');
});
