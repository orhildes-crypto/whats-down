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
    getParentsByIdRequestSchema,
    createManyRequestSchema,
} from './validations.js';
import { config } from '@/config.js';

export const systemRouter = Router();

systemRouter.get(
    '/',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER, UserRole.SYSTEM]),
    validateRequest(getByQueryRequestSchema),
    wrapController(SystemServiceController.getByQuery),
);

systemRouter.get(
    '/count',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER, UserRole.SYSTEM]),
    validateRequest(getCountRequestSchema),
    wrapController(SystemServiceController.getCount),
);

systemRouter.get(
    '/roots',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER]),
    validateRequest(getRootsByQueryRequestSchema),
    wrapController(SystemServiceController.getRoots),
);

systemRouter.get(
    '/:id',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER]),
    validateRequest(getByIdRequestSchema),
    wrapController(SystemServiceController.getById),
);

systemRouter.get(
    '/:id/parents',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER]),
    validateRequest(getParentsByIdRequestSchema),
    wrapController(SystemServiceController.getParentsOfSystem),
);

systemRouter.post(
    '/',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR, UserRole.SYSTEM]),
    validateRequest(createOneRequestSchema),
    wrapController(SystemServiceController.createOne),
);

systemRouter.post(
    '/many',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.SYSTEM]),
    validateRequest(createManyRequestSchema),
    wrapController(SystemServiceController.createMany),
);

systemRouter.put(
    '/:id/name',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR]),
    validateRequest(editServiceRequestSchema),
    wrapController(SystemServiceController.renameSystem),
);

systemRouter.put(
    '/:id/status',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN, UserRole.EDITOR]),
    validateRequest(changeStatusRequestSchema),
    wrapController(SystemServiceController.changeStatus),
);

systemRouter.delete(
    '/:id',
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware([UserRole.ADMIN]),
    validateRequest(deleteOneRequestSchema),
    wrapController(SystemServiceController.deleteOne),
);
