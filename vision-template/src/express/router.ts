import { Router } from 'express';
import { featuresRouter } from './features/router.js';

export const appRouter = Router();

appRouter.use('/api/features', featuresRouter);

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(200).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});
