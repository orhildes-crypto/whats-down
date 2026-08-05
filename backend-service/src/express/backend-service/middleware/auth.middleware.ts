import jwt from 'jsonwebtoken';
import { AuthenticationError } from '@whats-down/shared';
import { COOKIE_NAME } from '@whats-down/shared';
import '@whats-down/shared';
import { Request, Response, NextFunction } from 'express';

export const authenticateMiddleware = (secret: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const token = req.cookies[COOKIE_NAME];

            if (!token) return next(new AuthenticationError());

            const verified = jwt.verify(token, secret) as { userId: string; role: 'ADMIN' | 'EDITOR' | 'VIEWER'; username: string};

            req.user = verified; 

            next();
        } catch (error) {
            next(new AuthenticationError());
        }
    };
};
