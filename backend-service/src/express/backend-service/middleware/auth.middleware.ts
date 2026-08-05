import '@whats-down/shared';
import { AuthenticationError, COOKIE_NAME, UserRole } from '@whats-down/shared';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateMiddleware = (secret: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const token = req.cookies[COOKIE_NAME];

            if (!token) return next(new AuthenticationError());

            const verified = jwt.verify(token, secret) as { userId: string; role: UserRole; username: string};

            req.user = verified; 

            next();
        } catch (error) {
            next(new AuthenticationError());
        }
    };
};
