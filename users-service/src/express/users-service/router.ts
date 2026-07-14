import { Router } from 'express';
import { wrapController, validateRequest } from '@whats-down/shared';
import { UsersServiceController } from './controller.js';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    loginRequestSchema,
    googleAuthRequestSchema,
} from './validations.js';

export const usersServiceRouter = Router();

usersServiceRouter.post('/', validateRequest(createOneRequestSchema), wrapController(UsersServiceController.createOne));
usersServiceRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(UsersServiceController.deleteOne));
usersServiceRouter.post('/login', validateRequest(loginRequestSchema), wrapController(UsersServiceController.login));
usersServiceRouter.post('/login/google', validateRequest(googleAuthRequestSchema), wrapController(UsersServiceController.loginWithGoogle));
