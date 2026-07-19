import 'dotenv/config';
import env from 'env-var';

const isProduction = env.get('NODE_ENV').asString() === 'production';

export const config = {
    service: {
        port: env.get('PORT').default(3000).required().asPortNumber(),
    },
    services: {
        usersServiceUrl: env.get('USERS_SERVICE_URL').required().asString(),
        systemsServiceUrl: env.get('SYSTEMS_SERVICE_URL').required().asString(),
    },
    jwt: {
        secret: isProduction 
            ? env.get('JWT_SECRET').required().asString()
            : env.get('JWT_SECRET').default('local-dev-secret-key-123').asString(),
    }
};