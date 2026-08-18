import { SafeUserDocument, UserRole } from '@whats-down/shared/common';
import { usersService } from '../api/usersApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const changeRole = async ({ userId, role }: { userId: string; role: UserRole }): Promise<SafeUserDocument> => {
    return await usersService.changeRole(role, userId);
};

export const useChangeRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: changeRole,
        onMutate: async ({ userId, role }) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });

            const previousQueries = queryClient.getQueriesData<SafeUserDocument[]>({
                queryKey: ['users'],
            });

            queryClient.setQueriesData<SafeUserDocument[]>({ queryKey: ['users'] }, oldUsers =>
                oldUsers?.map(user => (user._id === userId ? { ...user, role } : user)),
            );

            return { previousQueries };
        },
        onError: (_error, _variables, context) => {
            context?.previousQueries.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data);
            });
        },
        onSuccess: user => {
            toast.success(`successfully changed ${user.username} role to ${user.role}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};