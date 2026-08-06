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
        onSuccess: (updatedSystem) => {
            // TODO - If getById is implemented in front - add defense againt old data not being array
            queryClient.setQueriesData<SystemDocument[]>({ queryKey: ['systems'] }, (oldData) => {
                if (!oldData) return [];
                return oldData.map((system) => (system._id === updatedSystem._id ? { ...system, name: updatedSystem.name } : system));
            });
        },
    });
};
