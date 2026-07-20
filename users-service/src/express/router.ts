import { Router } from 'express';
import {  usersServiceRouter } from './users-service/router.js';

export const appRouter = Router();

appRouter.use('/api/users-service', usersServiceRouter);

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(200).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});
