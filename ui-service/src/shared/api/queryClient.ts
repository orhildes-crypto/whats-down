import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import axios from 'axios';
import router from '../router';
import toast from 'react-hot-toast';


const handleGlobalError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.isAuthError) {
        router.navigate('/login', { replace: true });
        return;
    }

    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ?? 'משהו השתבש, נסה שוב';
        toast.error(message);
    }
};

export const queryClient = new QueryClient({
    queryCache: new QueryCache({ onError: handleGlobalError }),
    mutationCache: new MutationCache({ onError: handleGlobalError }),
});