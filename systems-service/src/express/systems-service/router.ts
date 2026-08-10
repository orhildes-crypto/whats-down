import { Router } from 'express';
import { UserRole, validateRequest, wrapController, authorizationMiddleware, authenticateMiddleware } from '@whats-down/shared';
import { SystemServiceController } from './controller.js';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    getCountRequestSchema,
    changeStatusRequestSchema,
    editServiceRequestSchema,
    getRootsByQueryRequestSchema,
    getAncestorsByIdRequestSchema,
} from './validations.js';
import { config } from '@/config.js';

export const systemServiceRouter = Router();

systemServiceRouter.get(
    '/',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER]),
    validateRequest(getByQueryRequestSchema),
    wrapController(SystemServiceController.getByQuery),
);

systemServiceRouter.get(
    '/count',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER]),
    validateRequest(getCountRequestSchema),
    wrapController(SystemServiceController.getCount),
);

systemServiceRouter.get(
    '/roots',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER]),
    validateRequest(getRootsByQueryRequestSchema),
    wrapController(SystemServiceController.getRoots),
);

systemServiceRouter.get(
    '/:id',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER]),
    validateRequest(getByIdRequestSchema),
    wrapController(SystemServiceController.getById),
);

systemServiceRouter.get(
    '/:id/ancestors',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER]),
    validateRequest(getAncestorsByIdRequestSchema),
    wrapController(SystemServiceController.getAncestors),
);

systemServiceRouter.post(
    '/',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR]),
    validateRequest(createOneRequestSchema),
    wrapController(SystemServiceController.createOne),
);

systemServiceRouter.put(
    '/:id/name',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR]),
    validateRequest(editServiceRequestSchema),
    wrapController(SystemServiceController.renameSystem),
);

systemServiceRouter.put(
    '/:id/status',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR]),
    validateRequest(changeStatusRequestSchema),
    wrapController(SystemServiceController.changeStatus),
);

systemServiceRouter.delete(
    '/:id',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN]),
    validateRequest(deleteOneRequestSchema),
    wrapController(SystemServiceController.deleteOne),
);
