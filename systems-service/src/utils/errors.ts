import {ServiceError} from '@whats-down/shared';
import { StatusCodes } from 'http-status-codes';

export class DocumentNotFoundError extends ServiceError {
    constructor(id: string) {
        super(StatusCodes.NOT_FOUND, `No system service found with id ${id}`);
    }
}

export class CreateCircleError extends ServiceError {
    constructor(systemId: string, parentId: string) {
        super(StatusCodes.UNPROCESSABLE_ENTITY, `Can not change parent id ${parentId} for system ${systemId}. Creates circle in tree`);
    }
}

export class SystemWithChildrenError extends ServiceError {
    constructor(systemId: string) {
        super(StatusCodes.UNPROCESSABLE_ENTITY, `Can not change status of system ${systemId}. This system has children`);
    }
}