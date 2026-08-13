import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../api/usersApi';
import { router } from '@/shared/router';

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersService.logout,
        onSuccess: () => {
            router.navigate({to: '/login', replace: true });
            queryClient.clear(); 
        },
        onError: () => {
            queryClient.clear();
            router.navigate({to: '/login', replace: true });
        },
    });
};
