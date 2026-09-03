import env from 'env-var';

export const config = {
    staleTime: {
        short: env
            .get('SHORT_STALE_TIME')
            .default(1000 * 60)
            .required()
            .asIntPositive(),
        standard: env
            .get('STANDARD_STALE_TIME')
            .default(1000 * 60 * 5)
            .required()
            .asIntPositive(),
        long: env
            .get('LONG_STALE_TIME')
            .default(1000 * 60 * 15)
            .required()
            .asIntPositive(),
    },
    polling: {
        systemsInterval: env
            .get('SYSTEMS_POLLING_INTERVAL')
            .default(1000 * 30)
            .required()
            .asIntPositive(),
    },
};
