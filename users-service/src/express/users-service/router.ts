import { Router } from 'express';
import { wrapController, validateRequest, authenticateMiddleware, authorizationMiddleware, UserRole } from '@whats-down/shared';
import { UsersServiceController } from './controller.js';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    loginRequestSchema,
    googleAuthRequestSchema,
    changeUserRoleRequestSchema,
    logoutRequestSchema,
    getMeRequestSchema,
} from './validations.js';
import { config } from '../../config.js';

export const usersServiceRouter = Router();

usersServiceRouter.get('/me', 
    validateRequest(getMeRequestSchema), 
    authenticateMiddleware(config.jwt.secret), 
    wrapController(UsersServiceController.getMe));

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
    authorizationMiddleware([UserRole.ADMIN]),
    validateRequest(deleteOneRequestSchema), 
    wrapController(UsersServiceController.deleteOne));

usersServiceRouter.patch('/:id/role',
    authenticateMiddleware(config.jwt.secret), 
    authorizationMiddleware([UserRole.ADMIN]),
    validateRequest(changeUserRoleRequestSchema), 
    wrapController(UsersServiceController.changeUserRole));

usersServiceRouter.post('/logout',
    validateRequest(logoutRequestSchema),
    wrapController(UsersServiceController.logout));
