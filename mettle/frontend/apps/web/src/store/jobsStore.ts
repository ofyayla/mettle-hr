import { create } from 'zustand';
import { Job } from '@/types';
import { jobsApi } from '@/services/api/jobs';
import toast from 'react-hot-toast';

interface JobsState {
    jobs: Job[];
    loading: boolean;
    error: string | null;
    selectedJob: Job | null;

    // Actions
    fetchJobs: () => Promise<void>;
    addJob: (job: Omit<Job, 'id' | 'createdAt' | 'applicantsCount' | 'status'>) => Promise<void>;
    updateJob: (job: Job) => Promise<void>;
    deleteJob: (id: string) => Promise<void>;
    setSelectedJob: (job: Job | null) => void;
}

export const useJobsStore = create<JobsState>((set, get) => ({
    jobs: [],
    loading: false,
    error: null,
    selectedJob: null,

    fetchJobs: async () => {
        set({ loading: true, error: null });
        try {
            const jobs = await jobsApi.list();
            set({ jobs, loading: false });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch jobs';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    addJob: async (jobData) => {
        try {
            const newJob = await jobsApi.create(jobData);
            set((state) => ({ jobs: [newJob, ...state.jobs] }));
            toast.success(`${newJob.title} created successfully`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create job';
            toast.error(message);
            throw error;
        }
    },

    updateJob: async (job: Job) => {
        try {
            const updated = await jobsApi.update(job.id, job);
            set((state) => ({
                jobs: state.jobs.map((j) => (j.id === job.id ? updated : j)),
                selectedJob: state.selectedJob?.id === job.id ? updated : state.selectedJob,
            }));
            toast.success('Job updated');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update job';
            toast.error(message);
            throw error;
        }
    },

    deleteJob: async (id: string) => {
        const job = get().jobs.find((j) => j.id === id);
        try {
            await jobsApi.delete(id);
            set((state) => ({
                jobs: state.jobs.filter((j) => j.id !== id),
                selectedJob: state.selectedJob?.id === id ? null : state.selectedJob,
            }));
            toast.success(`${job?.title || 'Job'} deleted`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete job';
            toast.error(message);
            throw error;
        }
    },

    setSelectedJob: (job) => {
        set({ selectedJob: job });
    },
}));
