import { Router } from 'express';
import { backendSystemsRouter } from './backend-service/routes/systems.routes.js';
import { backendUsersRouter } from './backend-service/routes/users.routes.js';

export const appRouter = Router();

appRouter.use('/users', backendUsersRouter);
appRouter.use('/systems', backendSystemsRouter);

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(200).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});
