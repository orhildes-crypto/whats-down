import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/users/api/usersApi';
import { AUTH_USER_QUERY_KEY } from '@/services/users/hooks/useMe';

const loginWithGoogle = async (idToken: string) => {
    return await usersService.loginWithGoogle(idToken);
};

export const useLoginWithGoogle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginWithGoogle,
        onSuccess: (user) => {
            queryClient.setQueryData(AUTH_USER_QUERY_KEY, user);
            queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
        },
    });
};