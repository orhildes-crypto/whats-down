import { z } from 'zod';
import { config } from '@/config.js'; 

export const refreshRequestSchema = z.object({
    cookies: z.object({
        [config.refreshToken.cookieName]: z.string().min(1, 'Refresh token is required'),
    }).passthrough(), 
});
