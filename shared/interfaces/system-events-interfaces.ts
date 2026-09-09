import z from 'zod';
import { systemEventFiltersSchema } from '../schemas/system-events-schemas.js';

export type SystemEventsFilters = z.infer<typeof systemEventFiltersSchema>;
