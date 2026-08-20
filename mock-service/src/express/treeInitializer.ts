import type { MockSystemNode } from './types.js';
import { MOCK_SYSTEM_NAMES } from './mockSystems.js';
import { v4 as uuidv4 } from 'uuid';

const generateRandomTree = (levelsRemaining: number): MockSystemNode => {
    const randomName = MOCK_SYSTEM_NAMES[Math.floor(Math.random() * MOCK_SYSTEM_NAMES.length)];

    if (!randomName) {
        throw new Error('MOCK_SYSTEM_NAMES is empty');
    }

    const root: MockSystemNode = {
        system: { id: uuidv4(), name: randomName },
    };

    if (levelsRemaining <= 1) return root;

    const forceLeft = Math.random() < 0.5;

    if (forceLeft || Math.random() < 0.5) {
        root.left = generateRandomTree(levelsRemaining - 1);
    }

    if (!forceLeft || Math.random() < 0.5) {
        root.right = generateRandomTree(levelsRemaining - 1);
    }

    return root;
};

export const generateForest = (): MockSystemNode[] => {
    const tree1Depth2 = generateRandomTree(2);
    const tree2Depth2 = generateRandomTree(2);
    const tree1Depth3 = generateRandomTree(3);
    const tree1Depth4 = generateRandomTree(4);
    const tree2Depth4 = generateRandomTree(4);
    return [tree1Depth2, tree2Depth2, tree1Depth3, tree1Depth4, tree2Depth4];
};


