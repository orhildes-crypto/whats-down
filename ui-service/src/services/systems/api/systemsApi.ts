import { apiClient } from '@/shared/api/apiClient';
import type { CreateSystemPayload, SystemDocument, SystemFilters, SystemQueryParams } from '@/shared/types/system-interfaces';
import type { SystemStatus } from '@whats-down/shared/common';

const BASE_URL = '/systems';

export const systemsService = {
    getByQuery: async (params: SystemQueryParams): Promise<SystemDocument[]> => {
        return (
            await apiClient.get<SystemDocument[]>(BASE_URL, {
                params,
            })
        ).data;
    },

    getRoots: async (step?: number, limit?: number): Promise<SystemDocument[]> => {
        return (
            await apiClient.get<SystemDocument[]>(`${BASE_URL}/roots`, {
                params: { step, limit },
            })
        ).data;
    },

    getCountByQuery: async (params: SystemFilters): Promise<number> => {
        return (
            await apiClient.get<number>(`${BASE_URL}/count`, {
                params: params,
            })
        ).data;
    },

    getParents: async (systemId: string): Promise<SystemDocument[]> => {
        return (await apiClient.get<SystemDocument[]>(`${BASE_URL}/${systemId}/parents`)).data;
    },

    rename: async (systemId: string, newName: string): Promise<SystemDocument> => {
        return (
            await apiClient.put<SystemDocument>(`${BASE_URL}/${systemId}/name`, {
                name: newName,
            })
        ).data;
    },

    getById: async (systemId: string): Promise<SystemDocument> => {
        return (await apiClient.get<SystemDocument>(`${BASE_URL}/${systemId}`)).data;
    },

    create: async (payload: CreateSystemPayload): Promise<SystemDocument> => {
        return (await apiClient.post<SystemDocument>(BASE_URL, payload)).data;
    },

    changeStatus: async (systemId: string, status: SystemStatus): Promise<SystemDocument> => {
        return (
            await apiClient.put<SystemDocument>(`${BASE_URL}/${systemId}/status`, {
                status,
            })
        ).data;
    },

    delete: async (systemId: string): Promise<SystemDocument> => {
        return (await apiClient.delete<SystemDocument>(`${BASE_URL}/${systemId}`)).data;
    },
};
