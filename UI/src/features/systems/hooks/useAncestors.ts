import { useQuery } from '@tanstack/react-query';
import { systemsService } from '../api/systemsApi';

export const useAncestors = (systemId: string) => {
    return useQuery({
        queryKey: ['systems', systemId, 'ancestors'],
        queryFn: () => systemsService.getAncestors(systemId),
        enabled: !!systemId,
    });
};