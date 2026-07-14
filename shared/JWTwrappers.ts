import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError, DeveloperError } from './errors.js';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './interface.js';


export const authenticateMiddleware = (secret: string) => {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

         if (!token) {
            throw new AuthenticationError();
        }

        try {
            const verified = jwt.verify(token, secret) as { userId: string; role: 'ADMIN' | 'EDITOR' | 'VIEWER';};

            req.user = verified; 

            next(); 
        } catch (error) {
            throw new AuthenticationError();
        }
    }
}

export const authorizationMiddleware = (authorizedRole: ('ADMIN' | 'EDITOR' | 'VIEWER')[]) => {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new DeveloperError("authorizationMiddleware must be used after authenticateMiddleware");
        }

        if (!authorizedRole.includes(req.user.role)) {
            throw new AuthorizationError();
        }

        next();
    }
};