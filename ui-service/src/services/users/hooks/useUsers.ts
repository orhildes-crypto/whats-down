import { useQuery } from '@tanstack/react-query';
import { usersService } from '../api/usersApi';
import type { UserQueryParams } from '@/shared/types/user-interfaces';

export const useUsers = (query: UserQueryParams) => {
    return useQuery({
        queryKey: ['users', query],
        queryFn: () => usersService.getByQuery(query),
    });
};