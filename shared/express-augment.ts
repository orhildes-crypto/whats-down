import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: 'ADMIN' | 'EDITOR' | 'VIEWER';
        username: string;
      };
    }
  }
}

export {};