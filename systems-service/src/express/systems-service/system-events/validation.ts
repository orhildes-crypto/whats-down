import { systemEventFiltersSchema } from '@whats-down/shared';
import { z } from 'zod';

// GET /systems/events
export const getByTimeRequestSchema = z.object({
    body: z.object({}),
    query: systemEventFiltersSchema,
    params: z.object({}),
});
