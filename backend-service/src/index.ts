/* v8 ignore start */
import { config } from './config.js';
import { Server } from './express/server.js';
import { logger } from './utils/logger/index.js';

const main = async () => {
    const server = new Server(config.service.port);

    await server.start();

    logger.info(`Backend proxy started on port: ${config.service.port}`);
};

main().catch(logger.error);
