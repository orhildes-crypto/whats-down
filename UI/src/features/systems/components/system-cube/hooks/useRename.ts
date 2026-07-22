import { useMutation, useQueryClient } from '@tanstack/react-query';
import { systemsService } from '../../../api/systemsApi';
import type { SystemServiceDocument } from '../../../../../shared/types/system-interfaces';

const rename = async ({ systemId, newName }: { systemId: string; newName: string }): Promise<SystemServiceDocument> => {
    return await systemsService.rename(systemId, newName);
};

export const useRename = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rename,
        onSuccess: (updatedSystem) => {
            // TODO - If getById is implemented in front - add defense againt old data not being array
            queryClient.setQueriesData<SystemServiceDocument[]>({ queryKey: ['systems'] }, (oldData) => {
                if (!oldData) return [];
                return oldData.map((system) => (system._id === updatedSystem._id ? updatedSystem : system));
            });
        },
    });
};
