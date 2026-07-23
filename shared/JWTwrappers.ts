import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError, DeveloperError } from './errors.js';
import { NextFunction, Response, Request } from 'express';
import { COOKIE_NAME } from './constants.js';


export const authenticateMiddleware = (secret: string) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const token = req.cookies[COOKIE_NAME]; 

         if (!token) {
            throw new AuthenticationError();
        }

        try {
            const verified = jwt.verify(token, secret) as { userId: string; role: 'ADMIN' | 'EDITOR' | 'VIEWER'; username: string;};

            req.user = verified; 

            next(); 
        } catch (error) {
            throw new AuthenticationError();
        }
    }
}

export const authorizationMiddleware = (authorizedRole: ('ADMIN' | 'EDITOR' | 'VIEWER')[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new DeveloperError("authorizationMiddleware must be used after authenticateMiddleware");
        }

        if (!authorizedRole.includes(req.user.role)) {
            throw new AuthorizationError();
        }

        next();
    }
};