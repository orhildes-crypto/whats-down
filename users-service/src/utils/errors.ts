/* eslint-disable max-classes-per-file */
import {ServiceError} from '@whats-down/shared';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

export class DocumentNotFoundError extends ServiceError {
    constructor(identifier: string) {
        super(StatusCodes.NOT_FOUND, `No user found with identifier ${identifier}`);
    }
}

export class PasswordIncorrectError extends ServiceError {
    constructor() {
        super(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }
}

export class GoogleAuthError extends ServiceError {
    constructor() {
        super(StatusCodes.UNAUTHORIZED, 'Invalid Google authentication token');
    }
}

export class SelfDemotionError extends ServiceError {
    constructor() {
        super(StatusCodes.BAD_REQUEST, 'You cannot demote yourself');
    }
}

export class SystemDemotionError extends ServiceError {
    constructor() {
        super(StatusCodes.FORBIDDEN, 'You cannot demote a system user');
    }
}

export class SystemDeleteError extends ServiceError {
    constructor() {
        super(StatusCodes.FORBIDDEN, 'You cannot delete a system user');
    }
}

export class ReuseTokenAttackDetected extends ServiceError {
    constructor(userId: mongoose.Types.ObjectId) {
        super(StatusCodes.UNAUTHORIZED, `reuse token hash attack detected for user id ${userId}`)
    }
}

export class InvalidOrExpiredTokenError extends ServiceError {
    constructor() {
        super(StatusCodes.UNAUTHORIZED, `token is invalid or expired`)
    }
}