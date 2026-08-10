import env from 'env-var';

export const COOKIE_NAME = env.get('COOKIE_NAME').default('whats-down-token').asString();

export const USER_NAME_TOO_SHORT = 3;
export const PASSWORD_TOO_SHORT = 8;
