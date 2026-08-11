import { useQuery } from '@tanstack/react-query';
import { systemsService } from '../api/systemsApi';
import type { SystemQueryParams } from '@/shared/types/system-interfaces';

export const useSystems = (query: SystemQueryParams) => {
    return useQuery({
        queryKey: ['systems', query],
        queryFn: () => query.parentId === undefined
            ? systemsService.getRoots(query.step, query.limit)
            : systemsService.getByQuery(query),
    });
};