import { useQuery } from '@tanstack/react-query';
import { systemsService } from '@/services/systems/api/systemsApi';
import type { SystemEventsFilters } from '@/shared/types/system-interfaces';

export const useSystemsEvents = (query: SystemEventsFilters) => {
    return useQuery({
        queryKey: ['systems-events', query],
        queryFn: () => systemsService.getEventsByTime(query),
    });
};
