export enum SystemStatus {
    UP = 'UP',
    DOWN = 'DOWN',
}

export const SystemStatusPriority: Record<SystemStatus, number> = {
    [SystemStatus.DOWN]: 0,
    [SystemStatus.UP]: 1,
};