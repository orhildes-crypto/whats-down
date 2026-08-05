import { apiClient } from '../../../shared/api/apiClient';
import {
    type SystemServiceDocument,
    type CreateSystemServicePayload,
    type SystemQueryParams,
    type SystemServiceFilters,
    type SystemCubeDTO,
} from '../../../shared/types/system-interfaces';

export const systemsService = {
    getByQuery: async (queryParams: SystemQueryParams): Promise<SystemCubeDTO[]> => {
        return (
            await apiClient.get<SystemCubeDTO[]>('/systems', {
                params: queryParams,
            })
        ).data;
    },

    getRoots: async (step: number, limit?: number): Promise<SystemCubeDTO[]> => {
        return (
            await apiClient.get<SystemCubeDTO[]>('/systems/roots', {
                params: { step, limit },
            })
        ).data;
    },

    getCountByQuery: async (queryParams: SystemServiceFilters): Promise<number> => {
        return (
            await apiClient.get<number>('/systems/count', {
                params: queryParams,
            })
        ).data;
    },

    getAncestors: async (systemId: string): Promise<SystemServiceDocument[]> => {
        return (
            await apiClient.get<SystemServiceDocument[]>(`/systems/${systemId}/ancestors`)
        ).data;
    },

    rename: async (systemId: string, newName: string): Promise<SystemServiceDocument> => {
        return (
            await apiClient.patch<SystemServiceDocument>(`/systems/${systemId}/name`, 
                {
                    name: newName
                }
            )
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
