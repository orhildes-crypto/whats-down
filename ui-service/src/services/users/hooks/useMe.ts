import { queryOptions, useQuery } from '@tanstack/react-query';
import { usersService } from '../api/usersApi';
import { config } from '@/config';

export const AUTH_USER_QUERY_KEY = ['authUser'] as const;

export const authUserQueryOptions = queryOptions({
  queryKey: AUTH_USER_QUERY_KEY,
  queryFn: usersService.getMe,
  retry: false,
  staleTime: config.staleTime.standard,
  meta: { skipGlobalErrorHandler: true },
});

export const useMe = () => {
  return useQuery(authUserQueryOptions);
};