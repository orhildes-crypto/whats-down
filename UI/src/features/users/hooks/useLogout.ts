import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { usersService } from '../api/usersApi';

const logoutUser = async (): Promise<void> => {
    await usersService.logout();
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logoutUser,
        onSettled: () => {
            queryClient.clear();
            navigate('/login', { replace: true });
        },
    });
};
