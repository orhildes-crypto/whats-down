import type { MockSystemNode } from './types.js';
import { MOCK_SYSTEM_NAMES } from './mockSystems.js';
import { ObjectId } from 'bson';
import { SystemStatus } from '@whats-down/shared';

const generateRandomTree = (levelsRemaining: number, parentId: string | null = null): MockSystemNode => {
    const randomName = MOCK_SYSTEM_NAMES[Math.floor(Math.random() * MOCK_SYSTEM_NAMES.length)];

    if (!randomName) {
        throw new Error('MOCK_SYSTEM_NAMES is empty');
    }

    const currentId = new ObjectId().toString();

    let leftChild: MockSystemNode | undefined;
    let rightChild: MockSystemNode | undefined;

    if (levelsRemaining > 1) {
        const forceLeft = Math.random() < 0.5;

        if (forceLeft || Math.random() < 0.5) {
            leftChild = generateRandomTree(levelsRemaining - 1, currentId);
        }

        if (!forceLeft || Math.random() < 0.5) {
            rightChild = generateRandomTree(levelsRemaining - 1, currentId);
        }
    }

    const hasChildren = Boolean(leftChild || rightChild);

    let status: SystemStatus;

    if (!hasChildren) {
        status = Math.random() < 0.5 ? SystemStatus.UP : SystemStatus.DOWN;
    } else {
        const isAnyChildDown =
            leftChild?.system.status === SystemStatus.DOWN ||
            rightChild?.system.status === SystemStatus.DOWN;

        status = isAnyChildDown ? SystemStatus.DOWN : SystemStatus.UP;
    }

    return {
        system: {
            _id: currentId,
            name: randomName,
            parentId,
            status,
            hasChildren,
        },
        left: leftChild,
        right: rightChild,
    };
};

export const generateForest = (): MockSystemNode[] => {
    const tree1Depth2 = generateRandomTree(2, null);
    const tree2Depth2 = generateRandomTree(2, null);
    const tree1Depth3 = generateRandomTree(3, null);
    const tree1Depth4 = generateRandomTree(4, null);
    const tree2Depth4 = generateRandomTree(4, null);
    return [tree1Depth2, tree2Depth2, tree1Depth3, tree1Depth4, tree2Depth4];
};