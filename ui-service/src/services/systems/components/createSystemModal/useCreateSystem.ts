import { systemsService } from '@/services/systems/api/systemsApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateSystem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: systemsService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['systems'] });
        },
    });
};
