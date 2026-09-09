import { faker } from '@faker-js/faker';
import { config } from '../config.js';

export const MOCK_SYSTEM_NAMES: string[] = faker.helpers.multiple(() => faker.animal.bird(), {
    count: config.fakerSeedAmount,
});
