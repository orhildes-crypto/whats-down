// backend-service/src/express/router.ts
import { Router } from 'express';
import { backendUsersRouter } from './backend-service/routes/users.routes.js';
import { backendSystemsRouter } from './backend-service/routes/systems.routes.js';

export const appRouter = Router();

appRouter.use('/api/users', backendUsersRouter);
appRouter.use('/api/systems', backendSystemsRouter);

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(200).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});
