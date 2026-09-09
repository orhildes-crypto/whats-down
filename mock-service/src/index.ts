import { config } from '@/config.js';
import { login } from './express/authClient.js';
import { createManySystems, getLeaves, getRootsCount } from './express/httpClient.js';
import { generateForest } from './express/treeInitializer.js';
import type { MockSystem } from './express/types.js';
import { SystemStatus } from '@whats-down/shared';
import { connectToRabbit, publishStatusUpdate } from './rabbitmq/producer.js';

const seedIfNeeded = async (): Promise<void> => {
    const rootsCount = await getRootsCount();

    if (rootsCount !== 0) {
        return;
    }

    const forest: MockSystem[] = generateForest();

    await createManySystems(forest);
};

const runCycle = async (): Promise<void> => {
    const leaves = await getLeaves();

    leaves.forEach((leaf) => {
        const status = Math.random() > 0.5 ? SystemStatus.DOWN : SystemStatus.UP;
        publishStatusUpdate(leaf._id, status);
    });
};

const main = async (): Promise<void> => {
    console.log('mock-service starting...');
    console.log(`config: interval=${config.intervalMs}ms`);

    await login();
    await connectToRabbit();
    await seedIfNeeded();

    setInterval(async () => {
        try {
            await runCycle();
        } catch (error) {
            console.error('Error during mock-service cycle:', error);
        }
    }, config.intervalMs);
};

main().catch((error) => {
    console.error('mock-service failed to start:', error);
    process.exit(1);
});
