import { apiClient } from '@/shared/api/apiClient';
import type {
    CreateSystemPayload,
    SystemDocument,
    SystemFilters,
    SystemQueryParams,
} from '@/shared/types/system-interfaces';
import type { SystemStatus } from '@whats-down/shared';

export const systemsService = {
    getByQuery: async (params: SystemQueryParams): Promise<SystemDocument[]> => {
        const { step = 0, limit = 10, ...filters } = params;

        return (
            await apiClient.get<SystemDocument[]>('/systems', {
                params: {
                    step,
                    limit,
                    ...filters,
                },
            })
        ).data;
    },

    getRoots: async (step = 0, limit = 10): Promise<SystemDocument[]> => {
        return (
            await apiClient.get<SystemDocument[]>('/systems/roots', {
                params: { step, limit },
            })
        ).data;
    },

    getCountByQuery: async (params: SystemFilters): Promise<number> => {
        return (
            await apiClient.get<number>('/systems/count', {
                params: params,
            })
        ).data;
    },

    getAncestors: async (systemId: string): Promise<SystemDocument[]> => {
        return (await apiClient.get<SystemDocument[]>(`/systems/${systemId}/ancestors`)).data;
    },

    rename: async (systemId: string, newName: string): Promise<SystemDocument> => {
        return (
            await apiClient.put<SystemDocument>(`/systems/${systemId}/name`, {
                name: newName,
            })
        ).data;
    },

    getById: async (systemId: string): Promise<SystemDocument> => {
        return (await apiClient.get<SystemDocument>(`/systems/${systemId}`)).data;
    },

    create: async (payload: CreateSystemPayload): Promise<SystemDocument> => {
        return (await apiClient.post<SystemDocument>('/systems', payload)).data;
    },

    changeStatus: async (systemId: string, status: SystemStatus): Promise<SystemDocument> => {
        return (
            await apiClient.put<SystemDocument>(`/systems/${systemId}/status`, {
                status: status,
            })
        ).data;
    },

    delete: async (systemId: string): Promise<SystemDocument> => {
        return (await apiClient.delete<SystemDocument>(`/systems/${systemId}`)).data;
    },
};
