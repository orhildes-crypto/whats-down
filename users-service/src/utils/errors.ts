/* eslint-disable max-classes-per-file */
import {ServiceError} from '@whats-down/shared';

export class DocumentNotFoundError extends ServiceError {
    constructor(identifier: string) {
        super(404, `No user found with identifier ${identifier}`);
    }
}

export class PasswordIncorrectError extends ServiceError {
    constructor() {
        super(401, 'Invalid credentials');
    }
}

export class GoogleAuthError extends ServiceError {
    constructor() {
        super(401, 'Invalid Google authentication token');
    }
}

export class SelfDemotionError extends ServiceError {
    constructor() {
        super(400, 'You cannot demote yourself');
    }
}
