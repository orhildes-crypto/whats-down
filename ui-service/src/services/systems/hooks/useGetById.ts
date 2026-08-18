import { useQuery } from '@tanstack/react-query';
import { systemsService } from '../api/systemsApi';

export const useGetById = (systemId: string | null | undefined) => {
    return useQuery({
        queryKey: ['systems', systemId],
        queryFn: async ({ queryKey }) => {
            const id = queryKey[1];
            if (!id) {
                throw new Error('System ID is required');
            }
            return systemsService.getById(id);
        },
        enabled: !!systemId,
    });
};