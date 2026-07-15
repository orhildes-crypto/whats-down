import { Response } from 'express';
import { COOKIE_NAME } from '@whats-down/shared';
import env from 'env-var';

export const setAuthCookie = (res: Response, token: string) => {
    res.cookie(COOKIE_NAME, token, { 
        httpOnly: true, 
        sameSite: 'lax', 
        secure: env.get('NODE_ENV').asString() === 'production',
        maxAge: 60 * 60 * 1000  });
};

export const clearAuthCookie = (res: Response) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.get('NODE_ENV').asString() === 'production',
    });
};