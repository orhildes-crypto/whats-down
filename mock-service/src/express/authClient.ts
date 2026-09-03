import { config } from '@/config.js';
import { config as sharedConf } from '@whats-down/shared';

let authToken: string | null = null;

export const login = async (): Promise<void> => {
    const response = await fetch(`${config.proxyBaseUrl}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: config.mockUser.username,
            password: config.mockUser.password,
        }),
    });

    if (!response.ok) {
        throw new Error(`mock-service login failed: ${response.status} ${response.statusText}`);
    }

   const setCookieHeaders = response.headers.getSetCookie 
        ? response.headers.getSetCookie() 
        : [response.headers.get('set-cookie') || ''];

    const rawCookie = setCookieHeaders.find((cookie) => cookie.includes(sharedConf.cookieName));

    if (!rawCookie) {
        throw new Error(`mock-service login failed: Cookie '${sharedConf.cookieName}' not found in Set-Cookie headers`);
    }

    const cleanCookieKeyValue = rawCookie.split(';')[0]?.trim();

    if (!cleanCookieKeyValue) {
        throw new Error('mock-service login failed: Failed to parse auth cookie');
    }

    authToken = cleanCookieKeyValue;
};

export const getAuthHeader = (): Record<string, string> => {
    if (!authToken) {
        throw new Error('mock-service is not authenticated - call login() first');
    }

    return {
        Cookie: authToken,
    };
};
