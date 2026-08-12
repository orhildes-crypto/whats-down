import { isProduction } from '@whats-down/shared';
import 'dotenv/config';
import env from 'env-var';

export const config = {
    service: {
        port: env.get('PORT').default(3000).required().asPortNumber(),
    },
    services: {
        usersServiceUrl: env.get('USERS_SERVICE_URL').required().asString(),
        systemsServiceUrl: env.get('SYSTEMS_SERVICE_URL').required().asString(),
    },
    jwt: {
        secret: isProduction ? env.get('JWT_SECRET').required().asString() : env.get('JWT_SECRET').default('local-dev-secret-key-123').asString(),
    },
    proxy: {
        publicRefreshPath: env.get('PUBLIC_REFRESH_PATH').default('/api/users/auth/refresh').asString(),
    },
    refreshToken: {
        cookieName: env.get('REFRESH_TOKEN_COOKIE_NAME').default('refreshToken').required().asString(),
    },
};
