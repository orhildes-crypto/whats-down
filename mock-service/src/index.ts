import { config } from '@/config.js';
import { login } from './express/authClient.js';
import { createManySystems, getRootsCount } from './express/httpClient.js';
import { generateForest } from './express/treeInitializer.js';
import type { MockSystem, MockSystemNode } from './express/types.js';

const flattenForest = (roots: MockSystemNode[]): MockSystem[] => {
    let result: MockSystem[] = [];

    roots.forEach((root) => {
        const queue: MockSystemNode[] = [root];

        while (queue.length > 0) {
            const current = queue.shift()!;
            result.push(current.system);

            if (current.left) queue.push(current.left);
            if (current.right) queue.push(current.right);
        }
    });

    return result;
};

const seedIfNeeded = async (): Promise<void> => {
    const rootsCount = await getRootsCount();

    if (rootsCount !== 0) {
        return;
    }

    const forest = generateForest();
    const flatSystems = flattenForest(forest);

    await createManySystems(flatSystems);
};

const main = async (): Promise<void> => {
    console.log('mock-service starting...');
    console.log(`config: interval=${config.intervalMs}ms`);

    await login();
    await seedIfNeeded();

    // TODO: כאן יתווסף בהמשך ה-setInterval/cron loop
};

main().catch((error) => {
    console.error('mock-service failed to start:', error);
    process.exit(1);
});
