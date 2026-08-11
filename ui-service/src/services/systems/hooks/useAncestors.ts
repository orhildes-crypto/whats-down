import { useQuery } from '@tanstack/react-query';
import { systemsService } from '../api/systemsApi';

export const useAncestors = (systemId: string | null | undefined) => {
    return useQuery({
        queryKey: ['systems', systemId, 'ancestors'],
        queryFn: async ({ queryKey }) => {
            const id = queryKey[1];
            if (!id) {
                throw new Error('System ID is required');
            }
            return systemsService.getAncestors(id);
        },
        enabled: !!systemId ,
    });
};