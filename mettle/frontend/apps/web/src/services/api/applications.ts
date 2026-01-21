import apiClient from './client';
import { env } from '@/config/env';

export interface Application {
    id: string;
    candidate_id: string;
    job_id: string;
    stage: string;
    applied_at: string;
}

export interface CreateApplicationDTO {
    candidate_id: string;
    job_id: string;
    stage?: string;
}

export interface UpdateApplicationDTO {
    stage: string;
}

// Mock data for development
let mockApplications: Application[] = [];
const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Check if we should use mock data
const useMockData = () => env.isDevelopment && !env.apiUrl.includes('localhost:8000');

/**
 * Applications API - Manages job applications and pipeline stages
 */
export const applicationsApi = {
    /**
     * List applications with optional filtering
     */
    list: async (params?: { job_id?: string; candidate_id?: string; stage?: string }): Promise<Application[]> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            let filtered = [...mockApplications];
            if (params?.job_id) filtered = filtered.filter(a => a.job_id === params.job_id);
            if (params?.candidate_id) filtered = filtered.filter(a => a.candidate_id === params.candidate_id);
            if (params?.stage) filtered = filtered.filter(a => a.stage === params.stage);
            return filtered;
        }
        const response = await apiClient.get<Application[]>('/applications', { params });
        return response.data;
    },

    /**
     * Get a single application
     */
    get: async (id: string): Promise<Application> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            const app = mockApplications.find(a => a.id === id);
            if (!app) throw new Error('Application not found');
            return app;
        }
        const response = await apiClient.get<Application>(`/applications/${id}`);
        return response.data;
    },

    /**
     * Create an application (link candidate to job)
     */
    create: async (data: CreateApplicationDTO): Promise<Application> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            const newApp: Application = {
                id: `app${Date.now()}`,
                candidate_id: data.candidate_id,
                job_id: data.job_id,
                stage: data.stage || 'Applied',
                applied_at: new Date().toISOString(),
            };
            mockApplications = [newApp, ...mockApplications];
            return newApp;
        }
        const response = await apiClient.post<Application>('/applications', data);
        return response.data;
    },

    /**
     * Update application stage (for pipeline movements)
     */
    updateStage: async (id: string, stage: string): Promise<Application> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            const index = mockApplications.findIndex(a => a.id === id);
            if (index === -1) throw new Error('Application not found');
            mockApplications[index] = { ...mockApplications[index], stage };
            return mockApplications[index];
        }
        const response = await apiClient.patch<Application>(`/applications/${id}`, { stage });
        return response.data;
    },

    /**
     * Delete an application
     */
    delete: async (id: string): Promise<void> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            mockApplications = mockApplications.filter(a => a.id !== id);
            return;
        }
        await apiClient.delete(`/applications/${id}`);
    },

    /**
     * Reset mock data (for testing)
     */
    _reset: () => {
        mockApplications = [];
    },
};
