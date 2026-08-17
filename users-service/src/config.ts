import { config as sharedConf } from '@whats-down/shared';
import 'dotenv/config';
import env from 'env-var';

export const config = {
    service: {
        port: env.get('PORT').default(8000).required().asPortNumber(),
    },
    mongo: {
        uri: env.get('MONGO_URI').default('mongodb://localhost').required().asString(),
        userCollectionName: env.get('USERS_SERVICE_COLLECTION_NAME').default('users-service').required().asString(),
    },
    google: {
        clientId: sharedConf.isProduction 
            ? env.get('GOOGLE_CLIENT_ID').required().asString()
            : env.get('GOOGLE_CLIENT_ID').default('local-dev-client-id-123').asString(),
    },
};
