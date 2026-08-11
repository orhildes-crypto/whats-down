import env from 'env-var';

export const COOKIE_NAME = env.get('COOKIE_NAME').default('whats-down-token').asString();
