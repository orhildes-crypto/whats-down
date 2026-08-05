import { apiClient } from '../../../shared/api/apiClient';
import { type SafeUserDocument, type CreateLocalUserPayload } from '../../../shared/types/user-interfaces';

export const usersService = {
    getMe: async (): Promise<SafeUserDocument> => {
        return (await apiClient.get<SafeUserDocument>('/users/me')).data;
    },

    createUser: async (payload: CreateLocalUserPayload): Promise<SafeUserDocument> => {
        return (
            await apiClient.post<SafeUserDocument>('/users', payload)
        ).data;
    },

    login: async (username: string, password: string): Promise<SafeUserDocument> => {
        return (
            await apiClient.post<SafeUserDocument>('/users/login', {
                username: username,
                password: password,
            })
        ).data;
    },

    loginWithGoogle: async (idToken: string): Promise<SafeUserDocument> => {
        return (
            await apiClient.post<SafeUserDocument>(
                '/users/login/google',
                {
                    idToken: idToken,
                },
            )
        ).data;
    },

    refresh: async (): Promise<{ success: boolean }> => {
        return (
            await apiClient.post<{ success: boolean }>('/users/auth/refresh')
        ).data;
    },

    changeRole: async (newRole: "ADMIN" | "EDITOR" | "VIEWER", userId: string): Promise<SafeUserDocument> => {
        return (
            await apiClient.patch<SafeUserDocument>(
                `/users/${userId}/role`, 
                {
                    role: newRole
                },
            )
        ).data;
    },

    delete: async (userId: string): Promise<SafeUserDocument> => {
        return (
            await apiClient.delete<SafeUserDocument>(`/users/${userId}`) 
        ).data;
    },

    logout: async (): Promise<{ message: string }> => {
        return (
            await apiClient.post<{message: string}>('/users/logout') 
        ).data;
    }
};
