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
        super(500, "An unexpected error occurred on the server.");
    }
}

export class AuthorizationError extends ServiceError {
    constructor(){
        super(403, 'Forbidden. You do not have permission to access this resource.');
    }
}

export class AuthenticationError extends ServiceError {
    constructor(){
        super(401, 'Unauthorized. You must be authenticated to access this resource.');
    }
}

export class DeveloperError extends ServiceError {
    constructor(message: string){
        super(500, `Developer Error: ${message}`);
    }
}

export class ConflictError extends ServiceError {
    constructor(message: string = 'Can not enter same document twice') {
        super(409, message);
    }
}