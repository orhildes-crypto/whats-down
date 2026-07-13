/* eslint-disable max-classes-per-file */
export class ServiceError extends Error {
    constructor(
        public code: number,
        message: string,
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

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
