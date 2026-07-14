import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError } from './errors.js';
import { NextFunction, Response, Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export const authenticateMiddleware = (secret: string) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

         if (!token) {
            throw new AuthenticationError();
        }

        try {
            const verified = jwt.verify(token, secret) as { userId: string; role: string;};

            req.user = verified; 

            next(); 
        } catch (error) {
            throw new AuthenticationError();
        }
    }
}

export const authorizationMiddleware = (authorizedRole: string[], req: any, res: any, next: any) => {
    if (!req.user) {
        throw new AuthenticationError();
    }

    if (!authorizedRole.includes(req.user.role)) {
        throw new AuthorizationError();
    }

    next();
};