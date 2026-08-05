import { apiClient } from '@/shared/api/apiClient';
import type {
    CreateSystemServicePayload,
    SystemCubeDTO,
    SystemServiceDocument,
    SystemServiceFilters,
    SystemQueryParams,
} from '@/shared/types/system-interfaces';

export const systemsService = {
    getByQuery: async (params: SystemQueryParams): Promise<SystemCubeDTO[]> => {
        const { step = 0, limit = 10, ...filters } = params;

        return (
            await apiClient.get<SystemCubeDTO[]>('/systems', {
                params: {
                    step,
                    limit,
                    ...filters,
                },
            })
        ).data;
    },

    getRoots: async (step = 0, limit = 10): Promise<SystemCubeDTO[]> => {
        return (
            await apiClient.get<SystemCubeDTO[]>('/systems/roots', {
                params: { step, limit },
            })
        ).data;
    },

    getCountByQuery: async (params: SystemServiceFilters): Promise<number> => {
        return (
            await apiClient.get<number>('/systems/count', {
                params: params,
            })
        ).data;
    },

    getAncestors: async (systemId: string): Promise<SystemServiceDocument[]> => {
        return (await apiClient.get<SystemServiceDocument[]>(`/systems/${systemId}/ancestors`)).data;
    },

    rename: async (systemId: string, newName: string): Promise<SystemServiceDocument> => {
        return (
            await apiClient.patch<SystemServiceDocument>(`/systems/${systemId}/name`, {
                name: newName,
            })
        ).data;
    },

    getById: async (systemId: string): Promise<SystemServiceDocument> => {
        return (await apiClient.get<SystemServiceDocument>(`/systems/${systemId}`)).data;
    },

    create: async (payload: CreateSystemServicePayload): Promise<SystemServiceDocument> => {
        return (await apiClient.post<SystemServiceDocument>('/systems', payload)).data;
    },

    changeStatus: async (systemId: string, status: 'UP' | 'DOWN'): Promise<SystemServiceDocument> => {
        return (
            await apiClient.patch<SystemServiceDocument>(`/systems/${systemId}/status`, {
                status: status,
            })
        ).data;
    },

    delete: async (systemId: string): Promise<SystemServiceDocument> => {
        return (await apiClient.delete<SystemServiceDocument>(`/systems/${systemId}`)).data;
    },
};
