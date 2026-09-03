import { config } from '@/config.js';
import { login } from './express/authClient.js';
import { createManySystems, getLeaves, getRootsCount } from './express/httpClient.js';
import { generateForest } from './express/treeInitializer.js';
import type { MockSystem, MockSystemNode } from './express/types.js';
import { SystemStatus } from '@whats-down/shared';
import { connectToRabbit, publishStatusUpdate } from './rabbitmq/producer.js';

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

const runCycle = async (): Promise<void> => {
    const leaves = await getLeaves();

    leaves.forEach((leaf) => {
        const status = Math.random() > 0.5 ? SystemStatus.DOWN : SystemStatus.UP;
        publishStatusUpdate(leaf._id, status);
    });
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async (): Promise<void> => {
    console.log('mock-service starting...');
    console.log(`config: interval=${config.intervalMs}ms`);

    await login();
    await connectToRabbit();
    await seedIfNeeded();

    while (true) {
        try {
            await runCycle();
        } catch (error) {
            console.error('Cycle failed:', error);
        }

        await delay(config.intervalMs);
    }
};

main().catch((error) => {
    console.error('mock-service failed to start:', error);
    process.exit(1);
});
