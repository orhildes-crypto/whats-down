import { StatusCodes } from 'http-status-codes';

export class ServiceError extends Error {
    constructor(
        public code: number,
        message: string,
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class InternalServerError extends ServiceError {
    constructor(){
        super(StatusCodes.INTERNAL_SERVER_ERROR, "An unexpected error occurred on the server.");
    }
}

export class AuthorizationError extends ServiceError {
    constructor(){
        super(StatusCodes.FORBIDDEN, 'Forbidden. You do not have permission to access this resource.');
    }
}

export class AuthenticationError extends ServiceError {
    constructor(){
        super(StatusCodes.UNAUTHORIZED, 'Unauthorized. You must be authenticated to access this resource.');
    }
}

export class DeveloperError extends ServiceError {
    constructor(message: string){
        super(StatusCodes.INTERNAL_SERVER_ERROR, `Developer Error: ${message}`);
    }
}

export class ConflictError extends ServiceError {
    constructor(message: string = 'Can not enter same document twice') {
        super(StatusCodes.CONFLICT, message);
    }
}