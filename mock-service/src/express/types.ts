export { type MockSystem } from '@whats-down/shared';
import { type MockSystem } from '@whats-down/shared';

export interface MockTreeNode<T> {
    system: T;
    left?: MockTreeNode<T>;
    right?: MockTreeNode<T>;
}

export type MockSystemNode = MockTreeNode<MockSystem>;
