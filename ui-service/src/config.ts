import 'dotenv/config';
import env from 'env-var';

export const config = {
    staleTime: {
        short: env.get('SHORT_STALE_TIME').default(1000 * 60 * 1).required().asPortNumber(),
        standard: env.get('STANDARD_STALE_TIME').default(1000 * 60 * 5).required().asPortNumber(),
        long: env.get('LONG_STALE_TIME').default(1000 * 60 * 15).required().asPortNumber(),
    },
};
