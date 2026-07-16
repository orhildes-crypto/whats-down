/* eslint-disable max-classes-per-file */
import {ServiceError} from '@whats-down/shared';
import mongoose from 'mongoose';

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

export class ReuseTokenAttackDetected extends ServiceError {
    constructor(userId: mongoose.Types.ObjectId) {
        super(401, `reuse token hash attack detected for user id ${userId}`)
    }
}

export class InvalidOrExpiredTokenError extends ServiceError {
    constructor() {
        super(401, `token is invalid or expired`)
    }
}