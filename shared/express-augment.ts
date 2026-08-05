import 'express';
import { UserRole } from './index.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
        username: string;
      };
    }
  }
}

export {};