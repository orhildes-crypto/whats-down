import type { MockSystemNode } from './types.js';
import { MOCK_SYSTEM_NAMES } from './mockSystems.js';
import { ObjectId } from 'bson';

const generateRandomTree = (levelsRemaining: number, parentId: string | null): MockSystemNode => {
    const randomName = MOCK_SYSTEM_NAMES[Math.floor(Math.random() * MOCK_SYSTEM_NAMES.length)];

    if (!randomName) {
        throw new Error('MOCK_SYSTEM_NAMES is empty');
    }

    const root: MockSystemNode = {
        system: { id: new ObjectId().toString(), name: randomName, parentId },
    };

    if (levelsRemaining <= 1) return root;

    const forceLeft = Math.random() < 0.5;

    if (forceLeft || Math.random() < 0.5) {
        root.left = generateRandomTree(levelsRemaining - 1, root.system.id);
    }

    if (!forceLeft || Math.random() < 0.5) {
        root.right = generateRandomTree(levelsRemaining - 1, root.system.id);
    }

    return root;
};

export const generateForest = (): MockSystemNode[] => {
    const tree1Depth2 = generateRandomTree(2, null);
    const tree2Depth2 = generateRandomTree(2, null);
    const tree1Depth3 = generateRandomTree(3, null);
    const tree1Depth4 = generateRandomTree(4, null);
    const tree2Depth4 = generateRandomTree(4, null);
    return [tree1Depth2, tree2Depth2, tree1Depth3, tree1Depth4, tree2Depth4];
};