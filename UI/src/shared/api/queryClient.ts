import { QueryClient, QueryCache } from '@tanstack/react-query';
import axios from 'axios';

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            if (axios.isAxiosError(error) && error.isAuthError) {
                // redirectToLogin();
            }
        },
    }),
});
