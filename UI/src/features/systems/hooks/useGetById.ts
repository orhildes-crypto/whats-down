import { useQuery } from '@tanstack/react-query';
import { systemsService } from '../api/systemsApi';

export const useGetById = (systemId: string | null | undefined) => {
    return useQuery({
        queryKey: ['systems', systemId],
        queryFn: () => systemsService.getById(systemId!),
        enabled: !!systemId,
    });
};