import { mockData } from '@/lib/mockData';
import { Candidate, Job } from '@/types';

// Simulating API calls with delays
const DELAY = 500;

export const api = {
    candidates: {
        list: async (): Promise<Candidate[]> => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(mockData.candidates), DELAY);
            });
        },
        get: async (id: string): Promise<Candidate | undefined> => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(mockData.candidates.find(c => c.id === id)), DELAY);
            });
        },
        create: async (candidate: Candidate): Promise<Candidate> => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // In a real app, backend assigns ID. Here we just push.
                    mockData.candidates.push(candidate);
                    resolve(candidate);
                }, DELAY);
            });
        },
        update: async (candidate: Candidate): Promise<Candidate> => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const index = mockData.candidates.findIndex(c => c.id === candidate.id);
                    if (index !== -1) {
                        mockData.candidates[index] = candidate;
                    }
                    resolve(candidate);
                }, DELAY);
            });
        }
    },
    jobs: {
        list: async (): Promise<Job[]> => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(mockData.jobs), DELAY);
            });
        }
    }
};
