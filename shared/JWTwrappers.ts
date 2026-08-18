import * as jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError, DeveloperError } from './errors.js';
import { NextFunction, Response, Request } from 'express';
import { UserRole } from './index.js';
import { setAuthCookie } from './cookie.js';
import { config } from './config.js';

interface TokenPayload {
    userId: string;
    role: UserRole;
    username: string;
    exp: number;
    iat: number;
}

export const authenticateMiddleware = (secret: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies[config.cookieName];

        if (!token) {
            return next(new AuthenticationError());
        }

        try {
            const verified = jwt.verify(token, secret) as TokenPayload;

            req.user = {
                userId: verified.userId,
                role: verified.role,
                username: verified.username,
            };

            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            const timeToLive = verified.exp - currentTimeInSeconds;

            if (timeToLive < config.session.refreshThresholdSeconds) {
                const newToken = jwt.sign(
                    {
                        userId: verified.userId,
                        role: verified.role,
                        username: verified.username,
                    },
                    secret,
                    { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] }
                );

                setAuthCookie(res, newToken);
            }

            next();
        } catch (error) {
            next(new AuthenticationError());
        }
    };
};

export const authorizationMiddleware = (authorizedRole: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new DeveloperError('authorizationMiddleware must be used after authenticateMiddleware'));
        }

        if (!authorizedRole.includes(req.user.role)) {
            return next(new AuthorizationError());
        }

        next();
    };
};
