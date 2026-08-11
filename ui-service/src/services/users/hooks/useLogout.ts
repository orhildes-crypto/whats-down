import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { usersService } from '../api/usersApi';

export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: usersService.logout,
        onSuccess: () => {
            navigate('/login', { replace: true });
            queryClient.clear(); 
        },
        onError: () => {
            queryClient.clear();
            navigate('/login', { replace: true });
        },
    });
};
