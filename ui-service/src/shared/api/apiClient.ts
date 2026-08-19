import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

declare module 'axios' {
    export interface AxiosError {
        isAuthError?: boolean;
    }
    export interface InternalAxiosRequestConfig {
        _retry?: boolean;
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

apiClient.interceptors.response.use(
    (res) => res,
    (error: unknown) => {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(error);
        }

        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
            error.isAuthError = true;
        }

        return Promise.reject(error);
    }
);
