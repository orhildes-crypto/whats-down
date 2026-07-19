import { Request, Response } from 'express';
import axios from 'axios';
import { rewriteSetCookiePath } from './cookie';

interface ProxyOptions {
    targetUrl: string;
    cookieRewritePath?: string;
}

export const forwardRequest = async (req: Request, res: Response, options: ProxyOptions): Promise<void> => {
    try {
        const clientCookies = req.headers.cookie;
        const contentType = req.headers['content-type'];

        const headers: Record<string, string> = {};
        if (clientCookies) headers['Cookie'] = clientCookies;
        if (contentType) headers['Content-Type'] = contentType;

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
    } catch (error) {
        res.status(502).send({
            error: 'Bad Gateway',
            message: 'The upstream service is unavailable or returned an invalid response.',
        });
    }
};
