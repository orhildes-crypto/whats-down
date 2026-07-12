import { Router } from 'express';
import { systemServiceRouter } from './system-service/router.js';

export const appRouter = Router();

appRouter.use('/api/features', systemServiceRouter);

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(200).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});
