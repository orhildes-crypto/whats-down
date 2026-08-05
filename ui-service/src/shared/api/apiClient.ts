import axios from 'axios';

declare module 'axios' {
    export interface AxiosError {
        isAuthError?: boolean;
    }
}

export const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },

    withCredentials: true,
    timeout: 10000,
});

let refreshPromise: Promise<void> | null = null;

apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalReq = error.config;

        if (error.response?.status === 401 && !originalReq._retry) {
            originalReq._retry = true;
            try {
                if (!refreshPromise) {
                    refreshPromise = axios
                        .post('/api/users/auth/refresh', {}, { withCredentials: true })
                        .then(() => {
                            refreshPromise = null; 
                        })
                        .catch((err) => {
                            refreshPromise = null; 
                            throw err;
                        });
                }

                await refreshPromise;

                return apiClient(originalReq);
            } catch (refreshError) {
                if (axios.isAxiosError(refreshError)) {
                    refreshError.isAuthError = true;
                }

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);
