import { config } from "./config.js";
import { Response } from 'express';

export const setAuthCookie = (res: Response, token: string) => {
    res.cookie(config.cookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: config.isProduction,
        maxAge: config.session.cookieMaxAgeMs,
        path: '/',
    });
};

export const clearAuthCookie = (res: Response) => {
    res.clearCookie(config.cookieName, {
        httpOnly: true,
        sameSite: 'lax',
        secure: config.isProduction,
        path: '/',
    });
};