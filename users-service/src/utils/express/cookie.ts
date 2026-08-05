import { Response } from 'express';
import { COOKIE_NAME } from '@whats-down/shared';
import { REFRESH_TOKEN_TTL } from '../../express/users-service/refresh-token/manager.js';
import env from 'env-var';

export const REFRESH_COOKIE_NAME = 'refreshToken';
const isProduction = env.get('NODE_ENV').asString() === 'production';;

export const REFRESH_PATH = '/api/users-service/auth/refresh';

export const setAuthCookie = (
    res: Response, 
    token: string, 
    options: { name?: string; path?: string; maxAge?: number } = {}) => {
    
        res.cookie(options.name ?? COOKIE_NAME, token, { 
        httpOnly: true, 
        sameSite: 'lax', 
        secure: isProduction,
        maxAge: options.maxAge ?? 60 * 60 * 1000,
        path:  options.path ?? '/'
    });
};

export const setRefreshCookie = (res: Response, token: string) => {
    
    setAuthCookie(res, token, {
        name: REFRESH_COOKIE_NAME,
        path: REFRESH_PATH, 
        maxAge: REFRESH_TOKEN_TTL
    });
};

export const clearAuthCookie = (res: Response) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        path: '/'
    });

    res.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        path: REFRESH_PATH,
    });
};