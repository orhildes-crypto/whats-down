import 'dotenv/config';
import env from 'env-var';

const isProduction = env.get('NODE_ENV').asString() === 'production';

export const config = {
    service: {
        port: env.get('PORT').default(8000).required().asPortNumber(),
    },
    mongo: {
        uri: env.get('MONGO_URI').default('mongodb://localhost').required().asString(),
        userCollectionName: env.get('USERS_SERVICE_COLLECTION_NAME').default('users-service').required().asString(),
    },
    google: {
        clientId: isProduction 
            ? env.get('GOOGLE_CLIENT_ID').required().asString()
            : env.get('GOOGLE_CLIENT_ID').default('local-dev-client-id-123').asString(),
    },
    jwt: {
        secret: isProduction 
            ? env.get('JWT_SECRET').required().asString()
            : env.get('JWT_SECRET').default('local-dev-secret-key-123').asString(),
    },
    refreshToken: {
        cookieName: env.get('REFRESH_TOKEN_COOKIE_NAME').default('refreshToken').required().asString(),
        refreshPath: env.get('REFRESH_TOKEN_PATH').default('/api/users-service/auth/refresh').required().asString(),
        refreshTokenTtl: env.get('REFRESH_TOKEN_TTL').default(7 * 24 * 60 * 60 * 1000).required().asIntPositive(),
        auditRetention: env.get('REFRESH_TOKEN_AUDIT_RETENTION').default(30 * 24 * 60 * 60 * 1000).required().asIntPositive(),
    }
};
