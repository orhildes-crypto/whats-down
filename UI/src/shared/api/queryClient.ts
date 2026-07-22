import { QueryClient, QueryCache } from '@tanstack/react-query';
import axios from 'axios';
import router from '../router';

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            if (axios.isAxiosError(error) && error.isAuthError) {
                router.navigate("/login", { replace: true });
            }
        },
    }),
});
