import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import axios from 'axios';
import { router } from '../router';
import toast from 'react-hot-toast';

const isAuthErrorAndRedirect = (error: unknown): boolean => {
    if (axios.isAxiosError(error) && error.isAuthError) {
        router.navigate({ to: '/login', replace: true });
        return true;
    }
    return false;
};

const showErrorToast = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ?? 'משהו השתבש, נסה שוב';
        toast.error(message);
    }
};

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error, query) => {
            if (query.meta?.skipGlobalErrorHandler) {
                return;
            }
            if (isAuthErrorAndRedirect(error)) {
                return;
            }
            showErrorToast(error);
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            if (isAuthErrorAndRedirect(error)) {
                return;
            }
            showErrorToast(error);
        },
    }),
});
