import { Router } from 'express';
import { systemsRouter } from './backend-service/routes/systems.js';
import { usersRouter } from './backend-service/routes/users.js';
import { StatusCodes } from 'http-status-codes';

export const appRouter = Router();

appRouter.use('/users', usersRouter);
appRouter.use('/systems', systemsRouter);

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(StatusCodes.OK).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(StatusCodes.NOT_FOUND).send('Invalid Route');
});
