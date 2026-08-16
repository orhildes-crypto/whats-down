import { apiClient } from '@/shared/api/apiClient';
import { type CreateLocalUserPayload, type SafeUserDocument } from '@/shared/types/user-interfaces';
import type { UserRole } from '@whats-down/shared/common';

const BASE_URL = '/users';

export const usersService = {
    getMe: async (): Promise<SafeUserDocument> => {
        return (await apiClient.get<SafeUserDocument>(`${BASE_URL}/me`)).data;
    },

    createUser: async (payload: CreateLocalUserPayload): Promise<SafeUserDocument> => {
        return (
            await apiClient.post<SafeUserDocument>(BASE_URL, payload)
        ).data;
    },

    login: async (username: string, password: string): Promise<SafeUserDocument> => {
        return  (
            await apiClient.post<SafeUserDocument>(`${BASE_URL}/login`, {
                username,
                password,
            })
        ).data;
        
    },

    loginWithGoogle: async (idToken: string): Promise<SafeUserDocument> => {
        return (
            await apiClient.post<SafeUserDocument>(
                `${BASE_URL}/login/google`,
                {
                    idToken,
                },
            )
        ).data;
    },

    refresh: async (): Promise<{ success: boolean }> => {
        return (
            await apiClient.post<{ success: boolean }>(`${BASE_URL}/auth/refresh`)
        ).data;
    },

    changeRole: async (role: UserRole, userId: string): Promise<SafeUserDocument> => {
        return (
            await apiClient.put<SafeUserDocument>(
                `${BASE_URL}/${userId}/role`, 
                {
                    role,
                },
            )
        ).data;
    },

    delete: async (userId: string): Promise<SafeUserDocument> => {
        return (
            await apiClient.delete<SafeUserDocument>(`${BASE_URL}/${userId}`) 
        ).data;
    },

    logout: async (): Promise<{ message: string }> => {
        return (
            await apiClient.post<{message: string}>(`${BASE_URL}/logout`) 
        ).data;
    }
};
