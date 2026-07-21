import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../../api/usersApi';

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersService.logout,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['authUser'] });
        },
    });
};
