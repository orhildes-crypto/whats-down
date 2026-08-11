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
    constructor(message: string = 'Forbidden. You do not have permission to access this resource.') {
        super(StatusCodes.FORBIDDEN, message);
    }
}

export class AuthenticationError extends ServiceError {
    constructor(message: string = 'Unauthorized. You must be authenticated to access this resource.') {
        super(StatusCodes.UNAUTHORIZED, message);
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