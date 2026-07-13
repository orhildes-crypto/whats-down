import 'dotenv/config';
import env from 'env-var';

export const config = {
    service: {
        port: env.get('PORT').default(8000).required().asPortNumber(),
    },
    mongo: {
        uri: env.get('MONGO_URI').default('mongodb://localhost').required().asString(),
        systemServiceCollectionName: env.get('SYSTEM_SERVICE_COLLECTION_NAME').default('system-services').required().asString(),
    },
};