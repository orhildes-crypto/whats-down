export interface MockSystem {
    id: string;
    name: string;
    parentId: string | null;
}

export interface MockTreeNode<T> {
    system: T;
    left?: MockTreeNode<T>;
    right?: MockTreeNode<T>;
}

export type MockSystemNode = MockTreeNode<MockSystem>;