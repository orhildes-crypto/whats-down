import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../../api/usersApi';
import type { SafeUserDocument } from '../../../../shared/types/user-interfaces';

const loginUser = async ({username, password}: { username: string; password: string }): Promise<SafeUserDocument> => {
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
