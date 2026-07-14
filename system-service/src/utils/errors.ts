/* eslint-disable max-classes-per-file */
import {ServiceError} from '@whats-down/shared';

export class DocumentNotFoundError extends ServiceError {
    constructor(id: string) {
        super(404, `No system service found with id ${id}`);
    }
}

export class CreateCircleError extends ServiceError {
    constructor(systemId: string, parentId: string) {
        super(422, `Can not change parent id ${parentId} for system ${systemId}. Creates circle in tree`);
    }
}

export class SystemWithChildrenError extends ServiceError {
    constructor(systemId: string) {
        super(422, `Can not change status of system ${systemId}. This system has children`);
    }
}