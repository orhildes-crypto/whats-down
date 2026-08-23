import 'dotenv/config';
import env from 'env-var';

export const config = {
    systemsServiceUrl: env.get('SYSTEMS_SERVICE_URL').required().asString(),
    proxyBaseUrl: env.get('BACKEND_SERVICE_URL').required().asString(),
    intervalMs: env
        .get('MOCK_INTERVAL_MS')
        .default(30 * 1000)
        .asIntPositive(),
    mockUser: {
        username: env.get('MOCK_USER_USERNAME').required().asString(),
        password: env.get('MOCK_USER_PASSWORD').required().asString(),
    },
};
