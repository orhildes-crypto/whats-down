import { config as sharedConf } from '@whats-down/shared';
import 'dotenv/config';
import env from 'env-var';

export const config = {
    service: {
        port: env.get('PORT').default(8000).required().asPortNumber(),
    },
    mongo: {
        uri: env.get('MONGO_URI').default('mongodb://localhost').required().asString(),
        systemServiceCollectionName: env.get('SYSTEM_SERVICE_COLLECTION_NAME').default('systems-service').required().asString(),
    },
    jwt: {
        secret: sharedConf.isProduction
            ? env.get('JWT_SECRET').required().asString()
            : env.get('JWT_SECRET').default('local-dev-secret-key-123').asString(),
    },
    model: {
        name: env.get('MODEL_NAME').default('SystemServiceModel').required().asString(),
    },
    systems: {
        maxParentsDepth: env.get('SYSTEMS_MAX_PARENTS_DEPTH').default(20).asIntPositive(),
    },
    rabbitmq: {
        url: env.get('RABBITMQ_URL').required().asString(),
    },
};
