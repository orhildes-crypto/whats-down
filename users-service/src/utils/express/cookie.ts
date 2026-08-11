import { config } from '@/config.js';
import { COOKIE_NAME } from '@whats-down/shared';
import { isProduction } from '@/config.js';
import { Response } from 'express';

const setCookie = (
    res: Response,
    name: string,
    token: string,
    options: { path?: string; maxAge?: number } = {}
) => {
    res.cookie(name, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        maxAge: options.maxAge ?? 60 * 60 * 1000,
        path: options.path ?? '/',
    });
};

export const setAuthCookie = (res: Response, token: string) => {
    setCookie(res, COOKIE_NAME, token, {
        maxAge: 60 * 60 * 1000,
        path: '/',
    });
};

export const setRefreshCookie = (res: Response, token: string) => {
    setCookie(res, config.refreshToken.cookieName, token, {
        path: config.refreshToken.refreshPath,
        maxAge: config.refreshToken.refreshTokenTtl,
    });
};

export const clearAuthCookies = (res: Response) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        path: '/',
    });

    res.clearCookie(config.refreshToken.cookieName, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        path: config.refreshToken.refreshPath,
    });
};