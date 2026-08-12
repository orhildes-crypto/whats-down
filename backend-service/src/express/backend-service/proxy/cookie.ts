import { config } from '@/config.js';
import cookie from 'cookie';
import setCookieParser, { Cookie } from 'set-cookie-parser';

type ExplicitSameSite = 'lax' | 'strict' | 'none';

const EXPLICIT_SAME_SITE_VALUES: readonly ExplicitSameSite[] = ['lax', 'strict', 'none'];

const isExplicitSameSite = (val: unknown): val is ExplicitSameSite =>
    typeof val === 'string' && EXPLICIT_SAME_SITE_VALUES.includes(val.toLowerCase() as ExplicitSameSite);

const resolveSameSite = (sameSite: unknown): ExplicitSameSite =>
    isExplicitSameSite(sameSite) ? (sameSite.toLowerCase() as ExplicitSameSite) : 'lax';

const resolvePath = (parsedCookie: Cookie, newPath: string): string =>
    parsedCookie.name === config.refreshToken.cookieName ? newPath : (parsedCookie.path ?? '/');

const rewriteCookie = (parsedCookie: Cookie, newPath: string): string => {
    const options: cookie.CookieSerializeOptions = {
        path: resolvePath(parsedCookie, newPath),
        httpOnly: parsedCookie.httpOnly,
        secure: parsedCookie.secure,
        sameSite: resolveSameSite(parsedCookie.sameSite),
        ...(parsedCookie.maxAge !== undefined && { maxAge: parsedCookie.maxAge }),
        ...(parsedCookie.expires !== undefined && { expires: parsedCookie.expires }),
        ...(parsedCookie.domain !== undefined && { domain: parsedCookie.domain }),
    };

    return cookie.serialize(parsedCookie.name, parsedCookie.value, options);
};

export const rewriteSetCookiePath = (rawCookies: string[], newPath: string): string[] =>
    setCookieParser.parse(rawCookies).map((parsedCookie) => rewriteCookie(parsedCookie, newPath));
