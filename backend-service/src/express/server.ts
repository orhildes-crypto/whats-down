import cookieParser from 'cookie-parser';
import { once } from 'events';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import { errorMiddleware } from '../utils/express/error.js';
import { loggerMiddleware } from '../utils/logger/middleware.js';
import { appRouter } from './router.js';

export class Server {
    private app: express.Application;
    private http?: http.Server;

    constructor(private port: number) {
        this.app = Server.createExpressApp();
    }

    static createExpressApp() {
        const app = express();
        app.use(cookieParser());
        app.use(helmet());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(loggerMiddleware);
        app.use('/api', appRouter);
        
        app.use(errorMiddleware);

        return app;
    }

    async start() {
        this.http = this.app.listen(this.port);
        await once(this.http, 'listening');
    }
}
