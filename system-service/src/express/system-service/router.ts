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

export const systemServiceRouter = Router();

systemServiceRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(SystemServiceController.getByQuery));
systemServiceRouter.get('/count', validateRequest(getCountRequestSchema), wrapController(SystemServiceController.getCount));
systemServiceRouter.get('/roots', validateRequest(getRootsByQueryRequestSchema), wrapController(SystemServiceController.getRoots));
systemServiceRouter.get('/:id', validateRequest(getByIdRequestSchema), wrapController(SystemServiceController.getById));
systemServiceRouter.post('/', validateRequest(createOneRequestSchema), wrapController(SystemServiceController.createOne));
systemServiceRouter.put('/:id', validateRequest(editServiceRequestSchema), wrapController(SystemServiceController.editService));
systemServiceRouter.patch('/:id/status', validateRequest(changeStatusRequestSchema), wrapController(SystemServiceController.changeStatus));
systemServiceRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(SystemServiceController.deleteOne));
