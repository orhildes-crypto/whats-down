import { useQuery } from '@tanstack/react-query';
import { usersService } from '../api/usersApi';

export const AUTH_USER_QUERY_KEY = ['authUser'] as const;

export const useMe = ()=> {
  return useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: usersService.getMe, 
    retry: false,
    staleTime: 1000 * 60 * 5, 
  });
};