import { useQuery } from '@tanstack/react-query';
import { usersService } from '../api/usersApi';

export const useMe = ()=> {
  return useQuery({
    queryKey: ['authUser'], 
    queryFn: usersService.getMe, 
    retry: false,
    staleTime: 1000 * 60 * 5, 
  });
};