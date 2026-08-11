import { systemsService } from '@/services/systems/api/systemsApi';
import type { SystemDocument } from '@/shared/types/system-interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const rename = async ({ systemId, newName }: { systemId: string; newName: string }): Promise<SystemDocument> => {
    return await systemsService.rename(systemId, newName);
};

export const useRename = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rename,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['systems'],
            });
        },
    });
};
