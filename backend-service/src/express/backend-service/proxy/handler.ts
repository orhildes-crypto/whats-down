import { createProxyMiddleware, fixRequestBody, Options } from 'http-proxy-middleware';
import { rewriteSetCookiePath } from './cookie.js';
import { StatusCodes } from 'http-status-codes';

interface ServiceProxyOptions {
    cookieRewritePath?: string;
}

export const createServiceProxy = (targetBaseUrl: string, options?: ServiceProxyOptions) => {
    const proxyOptions: Options = {
        target: targetBaseUrl,
        changeOrigin: true,
        on: {
            proxyReq: fixRequestBody,
            proxyRes: (proxyRes) => {
                const setCookieHeader = proxyRes.headers['set-cookie'];

                if (setCookieHeader && options?.cookieRewritePath) {
                    proxyRes.headers['set-cookie'] = rewriteSetCookiePath(setCookieHeader, options.cookieRewritePath);
                }
            },
            error: (err, _req, res) => {
                console.error(`[Proxy Error] Failed to forward request to ${targetBaseUrl}:`, err);

                if ('writeHead' in res && !res.headersSent) {
                    res.writeHead(StatusCodes.BAD_GATEWAY, { 'Content-Type': 'application/json' });
                }

                res.end(
                    JSON.stringify({
                        error: 'Bad Gateway',
                        message: 'The upstream service is unavailable or returned an invalid response.',
                    }),
                );
            },
        },
    };

    return createProxyMiddleware(proxyOptions);
};