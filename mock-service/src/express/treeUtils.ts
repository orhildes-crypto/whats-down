import { generateForest } from "./treeInitializer.js";
import { MockSystem, MockSystemNode } from "./types.js";

export const getLeavesOfRoot = (root: MockSystemNode): MockSystem[] => {
    const leaves: MockSystem[] = [];

    const traverse = (systemNode?: MockSystemNode): void => {
        if (!systemNode) return;

        if (!systemNode.left && !systemNode.right) {
            leaves.push(systemNode.system);
            return;
        }

        traverse(systemNode.left);
        traverse(systemNode.right);
    }

    traverse(root);
    return leaves;
};

export const getLeavesOfForest = (roots: MockSystemNode[]): MockSystem[] => {
    const leaves: MockSystem[] = [];

    roots.forEach(root => {
        leaves.push(...getLeavesOfRoot(root))
    })

    return leaves;
}

console.log(getLeavesOfForest(generateForest()));