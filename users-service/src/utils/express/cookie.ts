import { config } from '@/config.js';
import { COOKIE_NAME } from '@whats-down/shared';
import env from 'env-var';
import { Response } from 'express';

const isProduction = env.get('NODE_ENV').asString() === 'production';

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
        name: config.refreshToken.cookieName,
        path: config.refreshToken.refreshPath,
        maxAge: config.refreshToken.refreshTokenTtl
    });
};

export const clearAuthCookie = (res: Response) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        path: '/'
    });

    res.clearCookie(config.refreshToken.cookieName, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        path: config.refreshToken.refreshPath,
    });
};