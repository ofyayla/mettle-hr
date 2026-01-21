import { create } from 'zustand';
import { Candidate } from '@/types';
import { candidatesApi } from '@/services/api/candidates';
import toast from 'react-hot-toast';

interface CandidatesState {
    candidates: Candidate[];
    loading: boolean;
    error: string | null;
    selectedCandidate: Candidate | null;

    // Actions
    fetchCandidates: () => Promise<void>;
    addCandidate: (candidate: Candidate) => Promise<void>;
    updateCandidate: (candidate: Candidate) => Promise<void>;
    deleteCandidate: (id: string) => Promise<void>;
    setSelectedCandidate: (candidate: Candidate | null) => void;
    updateCandidateStatus: (id: string, status: Candidate['status']) => Promise<void>;
}

export const useCandidatesStore = create<CandidatesState>((set, get) => ({
    candidates: [],
    loading: false,
    error: null,
    selectedCandidate: null,

    fetchCandidates: async () => {
        set({ loading: true, error: null });
        try {
            const candidates = await candidatesApi.list();
            set({ candidates, loading: false });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch candidates';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    addCandidate: async (candidate: Candidate) => {
        try {
            const newCandidate = await candidatesApi.create(candidate);
            set((state) => ({ candidates: [newCandidate, ...state.candidates] }));
            toast.success(`${candidate.name} added successfully`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to add candidate';
            toast.error(message);
            throw error;
        }
    },

    updateCandidate: async (candidate: Candidate) => {
        try {
            const updated = await candidatesApi.update(candidate.id, candidate);
            set((state) => ({
                candidates: state.candidates.map((c) => (c.id === candidate.id ? updated : c)),
                selectedCandidate: state.selectedCandidate?.id === candidate.id ? updated : state.selectedCandidate,
            }));
            toast.success('Candidate updated');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update candidate';
            toast.error(message);
            throw error;
        }
    },

    deleteCandidate: async (id: string) => {
        const candidate = get().candidates.find((c) => c.id === id);
        try {
            await candidatesApi.delete(id);
            set((state) => ({
                candidates: state.candidates.filter((c) => c.id !== id),
                selectedCandidate: state.selectedCandidate?.id === id ? null : state.selectedCandidate,
            }));
            toast.success(`${candidate?.name || 'Candidate'} deleted`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete candidate';
            toast.error(message);
            throw error;
        }
    },

    setSelectedCandidate: (candidate) => {
        set({ selectedCandidate: candidate });
    },

    updateCandidateStatus: async (id: string, status: Candidate['status']) => {
        const candidate = get().candidates.find((c) => c.id === id);
        if (!candidate) return;

        // Optimistic update
        set((state) => ({
            candidates: state.candidates.map((c) => (c.id === id ? { ...c, status } : c)),
        }));

        try {
            await candidatesApi.update(id, { ...candidate, status });
        } catch (error) {
            // Rollback on error
            set((state) => ({
                candidates: state.candidates.map((c) => (c.id === id ? candidate : c)),
            }));
            const message = error instanceof Error ? error.message : 'Failed to update status';
            toast.error(message);
            throw error;
        }
    },
}));
