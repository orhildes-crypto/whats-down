import { useMutation, useQueryClient } from '@tanstack/react-query';
import { systemsService } from '../../../api/systemsApi';
import type { SystemDocument } from '../../../../../shared/types/system-interfaces';
import type { SystemStatus } from '@whats-down/shared/common';

const changeStatus = async ({systemId, status}: {systemId: string, status: SystemStatus}): Promise<SystemDocument> => {
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