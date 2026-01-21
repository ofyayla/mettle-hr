import { Job } from '@/types';
import { mockJobs } from '@/lib/mockData';
import apiClient from './client';
import { env } from '@/config/env';

// DTO types for API operations
export interface CreateJobDTO {
    title: string;
    department: Job['department'];
    location: string;
    type: Job['type'];
    description?: string;
    requirements?: string[];
}

export interface UpdateJobDTO extends Partial<CreateJobDTO> {
    status?: Job['status'];
}

// In-memory store for mock fallback
let jobsData = [...mockJobs];
const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Check if we should use mock data
const useMockData = () => env.isDevelopment && !env.apiUrl.includes('localhost:8000');

/**
 * Jobs API - Connects to FastAPI backend with mock fallback
 */
export const jobsApi = {
    /**
     * Get all jobs
     */
    list: async (): Promise<Job[]> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            return [...jobsData];
        }
        const response = await apiClient.get<Job[]>('/jobs');
        return response.data;
    },

    /**
     * Get a single job by ID
     */
    get: async (id: string): Promise<Job> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            const job = jobsData.find((j) => j.id === id);
            if (!job) throw new Error('Job not found');
            return { ...job };
        }
        const response = await apiClient.get<Job>(`/jobs/${id}`);
        return response.data;
    },

    /**
     * Create a new job
     */
    create: async (data: CreateJobDTO): Promise<Job> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            const newJob: Job = {
                id: `j${Date.now()}`,
                title: data.title,
                department: data.department,
                location: data.location,
                type: data.type,
                status: 'Draft',
                applicantsCount: 0,
                createdAt: new Date().toISOString(),
                description: data.description,
                requirements: data.requirements,
            };
            jobsData = [newJob, ...jobsData];
            return newJob;
        }
        const response = await apiClient.post<Job>('/jobs', {
            ...data,
            job_type: data.type, // Map to backend field name
        });
        return response.data;
    },

    /**
     * Update an existing job
     */
    update: async (id: string, data: UpdateJobDTO): Promise<Job> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            const index = jobsData.findIndex((j) => j.id === id);
            if (index === -1) throw new Error('Job not found');
            const updated: Job = { ...jobsData[index], ...data };
            jobsData[index] = updated;
            return updated;
        }
        const response = await apiClient.patch<Job>(`/jobs/${id}`, {
            ...data,
            job_type: data.type, // Map to backend field name
        });
        return response.data;
    },

    /**
     * Delete a job
     */
    delete: async (id: string): Promise<void> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            const index = jobsData.findIndex((j) => j.id === id);
            if (index === -1) throw new Error('Job not found');
            jobsData = jobsData.filter((j) => j.id !== id);
            return;
        }
        await apiClient.delete(`/jobs/${id}`);
    },

    /**
     * Reset mock data (for testing)
     */
    _reset: () => {
        jobsData = [...mockJobs];
    },
};
