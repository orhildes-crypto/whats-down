import { useMutation, useQueryClient } from '@tanstack/react-query';
import { systemsService } from '../../../api/systemsApi';
import type { SystemServiceDocument } from '../../../../../shared/types/system-interfaces';

const changeStatus = async ({systemId, status}: {systemId: string, status: "UP" | "DOWN"}): Promise<SystemServiceDocument> => {
    return await systemsService.changeStatus(systemId, status);
}

export const useChangeStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: changeStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['systems'] })
        }
    });
};