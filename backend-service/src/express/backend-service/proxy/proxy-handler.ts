import { Request, Response } from 'express';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { rewriteSetCookiePath } from './cookie.js';

interface ProxyOptions {
    targetUrl: string;
    cookieRewritePath?: string;
}

export const forwardRequest = async (req: Request, res: Response, options: ProxyOptions): Promise<void> => {
    try {
        const headers = { ...req.headers };
        delete headers.host;
        delete headers['content-length'];

        const response = await axios({
            method: req.method,
            url: options.targetUrl,
            headers,
            data: req.body,
            validateStatus: () => true,
        });

        let setCookieHeader = response.headers['set-cookie'];

        if (setCookieHeader && options.cookieRewritePath) {
            setCookieHeader = rewriteSetCookiePath(setCookieHeader, options.cookieRewritePath);
        }

        if (setCookieHeader) {
            res.setHeader('Set-Cookie', setCookieHeader);
        }

        res.status(response.status).send(response.data);
    } catch (error: any) {
        console.error(`[Proxy Error] Failed to forward request to ${options.targetUrl}:`, {
            message: error.message,
            code: error.code,
            stack: error.stack,
        });

        res.status(StatusCodes.BAD_GATEWAY).send({
            error: 'Bad Gateway',
            message: 'The upstream service is unavailable or returned an invalid response.',
        });
    }
};
