import { systemsService } from '@/services/systems/api/systemsApi';
import type { CreateSystemPayload, SystemDocument } from '@/shared/types/system-interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const createSystem = async ({ payload }: { payload: CreateSystemPayload }): Promise<SystemDocument> => {
    return await systemsService.create(payload);
}

export const useCreateSystem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSystem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['systems'] })
        }
    });
};