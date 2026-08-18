import { createProxyMiddleware, fixRequestBody, Options } from 'http-proxy-middleware';
import { StatusCodes } from 'http-status-codes';

export const createServiceProxy = (targetBaseUrl: string) => {
    const proxyOptions: Options = {
        target: targetBaseUrl,
        changeOrigin: true,
        on: {
            proxyReq: fixRequestBody,
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