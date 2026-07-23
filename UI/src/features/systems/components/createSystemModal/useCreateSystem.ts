import { useMutation, useQueryClient } from '@tanstack/react-query';
import { systemsService } from '../../api/systemsApi';
import type { CreateSystemServicePayload, SystemServiceDocument } from '../../../../shared/types/system-interfaces';

const createSystem = async ({ payload }: { payload: CreateSystemServicePayload }): Promise<SystemServiceDocument> => {
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