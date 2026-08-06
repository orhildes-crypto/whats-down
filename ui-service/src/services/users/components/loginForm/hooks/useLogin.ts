import { usersService } from '@/services/users/api/usersApi';
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
            queryClient.setQueryData(['authUser'], user);
        },
    });
};
