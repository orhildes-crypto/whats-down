import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { ServiceError } from '@whats-down/shared';
import { ReuseTokenAttackDetected, InvalidOrExpiredTokenError } from '../errors.js';
import { clearAuthCookie } from './cookie.js';
import { StatusCodes } from 'http-status-codes';

export const errorMiddleware = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).send({
            type: error.name,
            message: fromZodError(error).message,
        });
    } else if (error instanceof ReuseTokenAttackDetected || error instanceof InvalidOrExpiredTokenError) {
        clearAuthCookie(res);
        res.status(error.code).send({
            type: error.name,
            message: error.message,
        });
    } else if (error instanceof ServiceError) {
        res.status(error.code).send({
            type: error.name,
            message: error.message,
        });
        /* v8 ignore start */
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            type: error.name,
            message: error.message,
        });
    }
    /* v8 ignore end */
};
