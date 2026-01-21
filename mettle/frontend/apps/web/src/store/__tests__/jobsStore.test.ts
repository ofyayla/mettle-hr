import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useJobsStore } from '../jobsStore';
import { Job } from '@/types';

// Mock the API module
vi.mock('@/services/api', () => ({
    jobsApi: {
        getAll: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockImplementation((data) => Promise.resolve(data)),
        update: vi.fn().mockImplementation((data) => Promise.resolve(data)),
        delete: vi.fn().mockResolvedValue(undefined)
    }
}));

// Mock job for testing
const mockJob: Job = {
    id: 'job-1',
    title: 'Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    status: 'Open',
    applicantsCount: 5,
    createdAt: new Date().toISOString(),
    description: 'Test job description',
    requirements: ['React', 'TypeScript']
};

describe('useJobsStore', () => {
    beforeEach(() => {
        useJobsStore.setState({
            jobs: [],
            loading: false,
            error: null,
            selectedJob: null
        });
    });

    it('should initialize with empty jobs', () => {
        const state = useJobsStore.getState();
        expect(state.jobs).toEqual([]);
        expect(state.loading).toBe(false);
    });

    it('should add a job to state', () => {
        useJobsStore.setState((state) => ({
            jobs: [...state.jobs, mockJob]
        }));

        const updatedState = useJobsStore.getState();
        expect(updatedState.jobs.length).toBe(1);
        expect(updatedState.jobs[0].title).toBe('Software Engineer');
    });

    it('should update a job in state', () => {
        useJobsStore.setState({ jobs: [mockJob] });

        useJobsStore.setState((state) => ({
            jobs: state.jobs.map((j) =>
                j.id === 'job-1' ? { ...j, title: 'Senior Engineer' } : j
            )
        }));

        const updatedState = useJobsStore.getState();
        expect(updatedState.jobs[0].title).toBe('Senior Engineer');
    });

    it('should delete a job from state', () => {
        useJobsStore.setState({ jobs: [mockJob] });

        useJobsStore.setState((state) => ({
            jobs: state.jobs.filter((j) => j.id !== 'job-1')
        }));

        const updatedState = useJobsStore.getState();
        expect(updatedState.jobs.length).toBe(0);
    });

    it('should set loading state', () => {
        useJobsStore.setState({ loading: true });
        expect(useJobsStore.getState().loading).toBe(true);
    });

    it('should set error state', () => {
        useJobsStore.setState({ error: 'Test error' });
        expect(useJobsStore.getState().error).toBe('Test error');
    });
});
