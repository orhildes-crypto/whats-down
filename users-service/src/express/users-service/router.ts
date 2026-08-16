import { config } from '@/config.js';
import { authenticateMiddleware, authorizationMiddleware, UserRole, validateRequest, wrapController } from '@whats-down/shared';
import { Router } from 'express';
import { UsersServiceController } from './controller.js';
import {
    changeUserRoleRequestSchema,
    createOneRequestSchema,
    deleteOneRequestSchema,
    getMeRequestSchema,
    getUsersRequestSchema,
    googleAuthRequestSchema,
    loginRequestSchema,
    logoutRequestSchema,
} from './validations.js';

export const usersServiceRouter = Router();

usersServiceRouter.get(
    '/me',
    validateRequest(getMeRequestSchema),
    authenticateMiddleware(config.jwt.secret),
    wrapController(UsersServiceController.getMe),
);

usersServiceRouter.get(
    '/',
    validateRequest(getUsersRequestSchema),
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN]),
    wrapController(UsersServiceController.getUsers),
);

usersServiceRouter.post('/', validateRequest(createOneRequestSchema), wrapController(UsersServiceController.createOne));

usersServiceRouter.post('/auth/refresh', wrapController(UsersServiceController.refresh));

usersServiceRouter.post('/login', validateRequest(loginRequestSchema), wrapController(UsersServiceController.login));

usersServiceRouter.post('/login/google', validateRequest(googleAuthRequestSchema), wrapController(UsersServiceController.loginWithGoogle));

usersServiceRouter.delete(
    '/:id',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN]),
    validateRequest(deleteOneRequestSchema),
    wrapController(UsersServiceController.deleteOne),
);

usersServiceRouter.put(
    '/:id/role',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN]),
    validateRequest(changeUserRoleRequestSchema),
    wrapController(UsersServiceController.changeUserRole),
);

usersServiceRouter.post('/logout', validateRequest(logoutRequestSchema), wrapController(UsersServiceController.logout));
