import { useQuery } from '@tanstack/react-query';
import { systemsService } from '../api/systemsApi';

export const useParents = (systemId: string | null | undefined) => {
    return useQuery({
        queryKey: ['systems', systemId, 'parents'],
        queryFn: async ({ queryKey }) => {
            const id = queryKey[1];
            if (!id) {
                throw new Error('System ID is required');
            }
            return systemsService.getParents(id);
        },
        enabled: !!systemId ,
    });
};