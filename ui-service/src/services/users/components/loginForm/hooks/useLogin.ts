import { usersService } from '@/services/users/api/usersApi';
import { AUTH_USER_QUERY_KEY } from '@/services/users/hooks/useMe';
import type { SafeUserDocument } from '@/shared/types/user-interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const loginUser = async ({ username, password }: { username: string; password: string }): Promise<SafeUserDocument> => {
    return await usersService.login(username, password);
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (user) => {
            queryClient.setQueryData(AUTH_USER_QUERY_KEY, user);
            queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
        },
    });
};
