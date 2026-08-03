import { useMutation, useQueryClient } from '@tanstack/react-query';
import { systemsService } from '../../../api/systemsApi';
import type { SystemServiceDocument } from '../../../../../shared/types/system-interfaces';

const deleteSystem = async ({ systemId }: { systemId: string }): Promise<SystemServiceDocument> => {
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
