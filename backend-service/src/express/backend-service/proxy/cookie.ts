import setCookieParser from 'set-cookie-parser';
import cookie from 'cookie';

type ExplicitSameSite = 'lax' | 'strict' | 'none';

const isExplicitSameSite = (val: unknown): val is ExplicitSameSite => {
    if (typeof val !== 'string') return false;
    return ['lax', 'strict', 'none'].includes(val.toLowerCase());
};

export const rewriteSetCookiePath = (rawCookies: string[], newPath: string): string[] => {
    const parsedCookies = setCookieParser.parse(rawCookies);

    const updatedCookies = parsedCookies.map((parsedCookie) => {
        if (parsedCookie.name === 'refreshToken') {
            parsedCookie.path = newPath;
        }

        return parsedCookie;
    });

    return updatedCookies.map((updatedCookie) => {
        const sameSiteValue: ExplicitSameSite = isExplicitSameSite(updatedCookie.sameSite)
            ? (updatedCookie.sameSite.toLowerCase() as ExplicitSameSite)
            : 'lax';

        return cookie.serialize(updatedCookie.name, updatedCookie.value, {
            path: updatedCookie.path,
            httpOnly: updatedCookie.httpOnly,
            sameSite: sameSiteValue,
            maxAge: updatedCookie.maxAge,
            expires: updatedCookie.expires,
            secure: updatedCookie.secure,
        });
    });
};
