import 'dotenv/config';
import env from 'env-var';

const isProduction = env.get('NODE_ENV').asString() === 'production';

export const config = {
    service: {
        port: env.get('PORT').default(8000).required().asPortNumber(),
    },
    mongo: {
        uri: env.get('MONGO_URI').default('mongodb://localhost').required().asString(),
        systemServiceCollectionName: env.get('SYSTEM_SERVICE_COLLECTION_NAME').default('systems-service').required().asString(),
    },
    jwt: {
        secret: isProduction 
            ? env.get('JWT_SECRET').required().asString()
            : env.get('JWT_SECRET').default('local-dev-secret-key-123').asString(),
    },
    model: {
        name: env.get('MODEL_NAME').default('SystemServiceModel').required().asString(),
    },
    name: {
        maxLettersAmount: env.get('NAME_MAX_LETTERS_AMOUNT').default(35).required().asIntPositive(),
        minLettersAmount: env.get('NAME_MIN_LETTERS_AMOUNT').default(3).required().asIntPositive(),
    }
};