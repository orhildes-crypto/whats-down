import { z } from 'zod';

export const systemEventFiltersSchema = z.object({
    systemId: z.string(),
    start: z.string().datetime(),
    end: z.string().datetime().or(z.literal('now')).optional().default('now'),
});
