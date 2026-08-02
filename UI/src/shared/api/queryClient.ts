import { QueryClient, QueryCache } from '@tanstack/react-query';
import axios from 'axios';
import router from '../router';
import toast from 'react-hot-toast';

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            if (axios.isAxiosError(error) && error.isAuthError) {
                router.navigate("/login", { replace: true });
            }

            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message ?? 'משהו השתבש, נסה שוב';
                toast.error(message);
            }
        },
    }),
});
