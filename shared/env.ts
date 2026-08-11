import env from 'env-var';

export const isProduction = env.get('NODE_ENV').asString() === 'production';