import { Candidate } from '@/types';
import { mockCandidates } from '@/lib/mockData';
import apiClient from './client';
import { env } from '@/config/env';

// DTO types for API operations
export interface CreateCandidateDTO {
    name: string;
    email: string;
    phone?: string;
    role: string;
    source: Candidate['source'];
    location?: string;
    skills: string[];
    photoUrl?: string;
    summary?: string;
    experience?: Candidate['experience'];
    education?: Candidate['education'];
    certifications?: Candidate['certifications'];
    appliedJobId?: string;
}

export interface UpdateCandidateDTO extends Partial<CreateCandidateDTO> {
    status?: Candidate['status'];
    score?: number;
    tags?: string[];
    resumeUrl?: string;
}

// In-memory store for mock fallback
let candidatesData = [...mockCandidates];
const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Check if we should use mock data
const useMockData = () => env.isDevelopment && !env.apiUrl.includes('localhost:8000');

/**
 * Candidates API - Connects to FastAPI backend with mock fallback
 */
export const candidatesApi = {
    /**
     * Get all candidates
     */
    list: async (): Promise<Candidate[]> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            return [...candidatesData];
        }
        const response = await apiClient.get<Candidate[]>('/candidates');
        return response.data;
    },

    /**
     * Get a single candidate by ID
     */
    get: async (id: string): Promise<Candidate> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            const candidate = candidatesData.find((c) => c.id === id);
            if (!candidate) throw new Error('Candidate not found');
            return { ...candidate };
        }
        const response = await apiClient.get<Candidate>(`/candidates/${id}`);
        return response.data;
    },

    /**
     * Create a new candidate
     */
    create: async (data: CreateCandidateDTO): Promise<Candidate> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            const newCandidate: Candidate = {
                id: `c${Date.now()}`,
                name: data.name,
                email: data.email,
                phone: data.phone,
                role: data.role,
                source: data.source,
                status: 'New',
                score: 0,
                tags: data.skills?.slice(0, 3) || [],
                createdAt: new Date().toISOString(),
                location: data.location,
                skills: data.skills || [],
                experienceYears: data.experience?.length || 0,
                photoUrl: data.photoUrl,
                summary: data.summary,
                experience: data.experience,
                education: data.education,
                certifications: data.certifications,
                appliedJobId: data.appliedJobId,
            };
            candidatesData = [newCandidate, ...candidatesData];
            return newCandidate;
        }
        // Map frontend field names to backend
        const response = await apiClient.post<Candidate>('/candidates', {
            ...data,
            photo_url: data.photoUrl,
            applied_job_id: data.appliedJobId,
        });
        return response.data;
    },

    /**
     * Update an existing candidate
     */
    update: async (id: string, data: UpdateCandidateDTO): Promise<Candidate> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            const index = candidatesData.findIndex((c) => c.id === id);
            if (index === -1) throw new Error('Candidate not found');
            const updated: Candidate = { ...candidatesData[index], ...data };
            candidatesData[index] = updated;
            return updated;
        }
        // Map frontend field names to backend
        const response = await apiClient.patch<Candidate>(`/candidates/${id}`, {
            ...data,
            photo_url: data.photoUrl,
            resume_url: data.resumeUrl,
        });
        return response.data;
    },

    /**
     * Delete a candidate
     */
    delete: async (id: string): Promise<void> => {
        if (useMockData()) {
            await delay(MOCK_DELAY);
            const index = candidatesData.findIndex((c) => c.id === id);
            if (index === -1) throw new Error('Candidate not found');
            candidatesData = candidatesData.filter((c) => c.id !== id);
            return;
        }
        await apiClient.delete(`/candidates/${id}`);
    },

    /**
     * Reset mock data (for testing)
     */
    _reset: () => {
        candidatesData = [...mockCandidates];
    },
};
