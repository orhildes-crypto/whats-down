import { config } from '@/config.js';
import { getAuthHeader, login } from './authClient.js';
import type { MockSystemsPayload, SystemDocument } from '@whats-down/shared';
import { StatusCodes } from 'http-status-codes';

interface RequestOptions {
    method: string;
    body?: unknown;
}

const request = async <T>(path: string, options: RequestOptions, isRetry = false): Promise<T> => {
    const { method, body } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
    };

    const response = await fetch(`${config.proxyBaseUrl}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === StatusCodes.UNAUTHORIZED && !isRetry) {
        await login();
        return request<T>(path, options, true);
    }

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json() as Promise<T>;
};

export const getRootsCount = async (): Promise<number> => {
    return request<number>('/api/systems/count?isRoot=true', { method: 'GET' });
};

export const createManySystems = async (payload: MockSystemsPayload): Promise<void> => {
    await request<void>('/api/systems/many', { method: 'POST', body: payload });
};

export const getLeaves = async (): Promise<SystemDocument[]> => {
    const PAGE_SIZE = 100;
    const MAX_ITERATIONS = 50;

    let allLeaves: SystemDocument[] = [];
    let step = 0;

    while (step < MAX_ITERATIONS) {
        const page = await request<SystemDocument[]>(`/api/systems?hasChildren=false&limit=${PAGE_SIZE}&step=${step}`, { method: 'GET' });

        allLeaves = allLeaves.concat(page);

        if (page.length < PAGE_SIZE) {
            break;
        }

        step++;
    }

    return allLeaves;
};
