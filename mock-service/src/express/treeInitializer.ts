import type { MockSystem } from './types.js';
import { MOCK_SYSTEM_NAMES } from './mockSystems.js';
import { ObjectId } from 'bson';
import { SystemStatus } from '@whats-down/shared';

const generateRandomTree = (levelsRemaining: number, parentId: string | null = null, systems: MockSystem[]): MockSystem => {
    const randomName = MOCK_SYSTEM_NAMES[Math.floor(Math.random() * MOCK_SYSTEM_NAMES.length)];

    const currentId = new ObjectId().toString();

    let leftChild: MockSystem | undefined;
    let rightChild: MockSystem | undefined;

    if (levelsRemaining > 1) {
        const forceLeft = Math.random() < 0.5;

        if (forceLeft || Math.random() < 0.5) {
            leftChild = generateRandomTree(levelsRemaining - 1, currentId, systems);
        }

        if (!forceLeft || Math.random() < 0.5) {
            rightChild = generateRandomTree(levelsRemaining - 1, currentId, systems);
        }
    }

    const hasChildren = Boolean(leftChild || rightChild);

    let status: SystemStatus;

    if (!hasChildren) {
        status = Math.random() < 0.5 ? SystemStatus.UP : SystemStatus.DOWN;
    } else {
        const isAnyChildDown = leftChild?.status === SystemStatus.DOWN || rightChild?.status === SystemStatus.DOWN;

        status = isAnyChildDown ? SystemStatus.DOWN : SystemStatus.UP;
    }

    const currentSystem: MockSystem = {
        _id: currentId,
        name: randomName!,
        parentId,
        status,
        hasChildren,
    };

    systems.push(currentSystem);

    return currentSystem;
};

export const generateForest = (): MockSystem[] => {
    const systems: MockSystem[] = [];
    generateRandomTree(2, null, systems);
    generateRandomTree(2, null, systems);
    generateRandomTree(3, null, systems);
    generateRandomTree(4, null, systems);
    generateRandomTree(4, null, systems);

    return systems;
};
