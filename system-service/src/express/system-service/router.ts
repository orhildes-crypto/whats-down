import { Router } from 'express';
import { validateRequest, wrapController } from '@whats-down/shared';
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
} from './validations.js';
import { authenticateMiddleware, authorizationMiddleware } from '@whats-down/shared';
import { config } from '../../config.js';

export const systemServiceRouter = Router();

systemServiceRouter.get('/', 
    authenticateMiddleware(config.jwt.secret),
    authorizationMiddleware(['ADMIN', 'EDITOR', 'VIEWER']),
    validateRequest(getByQueryRequestSchema), 
    wrapController(SystemServiceController.getByQuery));
systemServiceRouter.get('/count', 
    authenticateMiddleware(config.jwt.secret), 
    authorizationMiddleware(['ADMIN', 'EDITOR', 'VIEWER']),
    validateRequest(getCountRequestSchema), 
    wrapController(SystemServiceController.getCount));
systemServiceRouter.get('/roots', 
    authenticateMiddleware(config.jwt.secret), 
    authorizationMiddleware(['ADMIN', 'EDITOR', 'VIEWER']),
    validateRequest(getRootsByQueryRequestSchema), 
    wrapController(SystemServiceController.getRoots));
systemServiceRouter.get('/:id', 
    authenticateMiddleware(config.jwt.secret), 
    authorizationMiddleware(['ADMIN', 'EDITOR', 'VIEWER']),
    validateRequest(getByIdRequestSchema), 
    wrapController(SystemServiceController.getById));

systemServiceRouter.post('/', 
    authenticateMiddleware(config.jwt.secret), 
    authorizationMiddleware(['ADMIN', 'EDITOR']),
    validateRequest(createOneRequestSchema), 
    wrapController(SystemServiceController.createOne));
systemServiceRouter.put('/:id', 
    authenticateMiddleware(config.jwt.secret), 
    authorizationMiddleware(['ADMIN', 'EDITOR']),
    validateRequest(editServiceRequestSchema), 
    wrapController(SystemServiceController.editService));
systemServiceRouter.patch('/:id/status', 
    authenticateMiddleware(config.jwt.secret), 
    authorizationMiddleware(['ADMIN', 'EDITOR']),
    validateRequest(changeStatusRequestSchema), 
    wrapController(SystemServiceController.changeStatus));

systemServiceRouter.delete('/:id', 
    authenticateMiddleware(config.jwt.secret), 
    authorizationMiddleware(['ADMIN']),
    validateRequest(deleteOneRequestSchema), 
    wrapController(SystemServiceController.deleteOne));
