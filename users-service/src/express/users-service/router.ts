import { Router } from 'express';
import { wrapController, validateRequest, authenticateMiddleware, authorizationMiddleware } from '@whats-down/shared';
import { UsersServiceController } from './controller.js';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    loginRequestSchema,
    googleAuthRequestSchema,
    changeUserRoleRequestSchema,
    logoutRequestSchema,
} from './validations.js';
import { config } from '../../config.js';

export const usersServiceRouter = Router();

usersServiceRouter.post('/', 
    validateRequest(createOneRequestSchema), 
    wrapController(UsersServiceController.createOne));

usersServiceRouter.post('/auth/refresh', 
    wrapController(UsersServiceController.refresh));

usersServiceRouter.post('/login', 
    validateRequest(loginRequestSchema),
    wrapController(UsersServiceController.login));

usersServiceRouter.post('/login/google', 
    validateRequest(googleAuthRequestSchema), 
    wrapController(UsersServiceController.loginWithGoogle));

usersServiceRouter.delete('/:id', 
    authenticateMiddleware(config.jwt.secret), 
    authorizationMiddleware(['ADMIN']),
    validateRequest(deleteOneRequestSchema), 
    wrapController(UsersServiceController.deleteOne));

usersServiceRouter.patch('/:id/role',
    authenticateMiddleware(config.jwt.secret), 
    authorizationMiddleware(['ADMIN']),
    validateRequest(changeUserRoleRequestSchema), 
    wrapController(UsersServiceController.changeUserRole));

usersServiceRouter.post('/logout',
    validateRequest(logoutRequestSchema),
    wrapController(UsersServiceController.logout));
