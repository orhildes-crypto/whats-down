import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../../../api/usersApi';

const loginWithGoogle = async (idToken: string) => {
    return await usersService.loginWithGoogle(idToken);
};

export const useLoginWithGoogle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginWithGoogle,
        onSuccess: (user) => {
            queryClient.setQueryData(['authUser'], user);
        },
    });
};