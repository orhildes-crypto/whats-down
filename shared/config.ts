import 'dotenv/config';
import * as env from 'env-var';

export const config = {
    isProduction: env.get('NODE_ENV').asString() === 'production',
    cookieName: env.get('COOKIE_NAME').default('whats-down-token').asString(),
    jwt: {
        secret: env.get('NODE_ENV').asString() === 'production'
            ? env.get('JWT_SECRET').required().asString()
            : env.get('JWT_SECRET').default('local-dev-secret-key-123').asString(),
        expiresIn: env.get('JWT_EXPIRES_IN').default('8h').required().asString(),
    },
    session: {
        cookieMaxAgeMs: env.get('COOKIE_MAX_AGE_MS').default(8 * 60 * 60 * 1000).required().asIntPositive(),
        refreshThresholdSeconds: env.get('REFRESH_THRESHOLD_SECONDS').default(15 * 60).required().asIntPositive(),
    },
};