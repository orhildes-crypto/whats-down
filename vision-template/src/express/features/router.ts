import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers.js';
import { FeaturesController } from './controller.js';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    getCountRequestSchema,
    updateOneRequestSchema,
} from './validations.js';

export const featuresRouter = Router();

featuresRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(FeaturesController.getByQuery));

featuresRouter.get('/count', validateRequest(getCountRequestSchema), wrapController(FeaturesController.getCount));

featuresRouter.get('/:id', validateRequest(getByIdRequestSchema), wrapController(FeaturesController.getById));

featuresRouter.post('/', validateRequest(createOneRequestSchema), wrapController(FeaturesController.createOne));

featuresRouter.put('/:id', validateRequest(updateOneRequestSchema), wrapController(FeaturesController.updateOne));

featuresRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(FeaturesController.deleteOne));
