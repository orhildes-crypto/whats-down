import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SystemDocument } from '../../../../shared/types/system-interfaces';
import { systemsService } from '../../api/systemsApi';

const deleteSystem = async ({ systemId }: { systemId: string }): Promise<SystemDocument> => {
    return await systemsService.delete(systemId);
};

export const useDeleteSystem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSystem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['systems'] });
        },
    });
};
