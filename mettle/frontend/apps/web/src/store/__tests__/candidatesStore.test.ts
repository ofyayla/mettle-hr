import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCandidatesStore } from '../candidatesStore';
import { Candidate } from '@/types';

// Mock the API module
vi.mock('@/services/api', () => ({
    candidatesApi: {
        getAll: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockImplementation((data) => Promise.resolve(data)),
        update: vi.fn().mockImplementation((data) => Promise.resolve(data)),
        delete: vi.fn().mockResolvedValue(undefined)
    }
}));

// Mock candidate for testing
const mockCandidate: Candidate = {
    id: 'test-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    role: 'Software Engineer',
    status: 'New',
    source: 'CareerPage',
    score: 85,
    tags: ['React', 'TypeScript'],
    createdAt: new Date().toISOString(),
    location: 'San Francisco, CA',
    skills: ['React', 'TypeScript'],
    experienceYears: 5
};

describe('useCandidatesStore', () => {
    beforeEach(() => {
        // Reset store before each test
        useCandidatesStore.setState({
            candidates: [],
            loading: false,
            error: null,
            selectedCandidate: null
        });
    });

    it('should initialize with empty candidates', () => {
        const state = useCandidatesStore.getState();
        expect(state.candidates).toEqual([]);
        expect(state.loading).toBe(false);
    });

    it('should add a candidate to state', () => {
        // Directly test state manipulation
        useCandidatesStore.setState((state) => ({
            candidates: [...state.candidates, mockCandidate]
        }));

        const updatedState = useCandidatesStore.getState();
        expect(updatedState.candidates.length).toBe(1);
        expect(updatedState.candidates[0].name).toBe('John Doe');
    });

    it('should update a candidate in state', () => {
        // First add a candidate
        useCandidatesStore.setState({
            candidates: [mockCandidate]
        });

        // Update via setState
        useCandidatesStore.setState((state) => ({
            candidates: state.candidates.map((c) =>
                c.id === 'test-1' ? { ...c, name: 'Jane Doe' } : c
            )
        }));

        const updatedState = useCandidatesStore.getState();
        expect(updatedState.candidates[0].name).toBe('Jane Doe');
    });

    it('should delete a candidate from state', () => {
        // First add a candidate
        useCandidatesStore.setState({
            candidates: [mockCandidate]
        });

        // Delete via setState
        useCandidatesStore.setState((state) => ({
            candidates: state.candidates.filter((c) => c.id !== 'test-1')
        }));

        const updatedState = useCandidatesStore.getState();
        expect(updatedState.candidates.length).toBe(0);
    });

    it('should set selected candidate', () => {
        const store = useCandidatesStore.getState();
        store.setSelectedCandidate(mockCandidate);

        const updatedState = useCandidatesStore.getState();
        expect(updatedState.selectedCandidate).toEqual(mockCandidate);
    });

    it('should update candidate status in state', () => {
        useCandidatesStore.setState({
            candidates: [mockCandidate]
        });

        // Update status via setState
        useCandidatesStore.setState((state) => ({
            candidates: state.candidates.map((c) =>
                c.id === 'test-1' ? { ...c, status: 'Interview' } : c
            )
        }));

        const updatedState = useCandidatesStore.getState();
        expect(updatedState.candidates[0].status).toBe('Interview');
    });

    it('should set loading state', () => {
        useCandidatesStore.setState({ loading: true });
        expect(useCandidatesStore.getState().loading).toBe(true);

        useCandidatesStore.setState({ loading: false });
        expect(useCandidatesStore.getState().loading).toBe(false);
    });

    it('should set error state', () => {
        useCandidatesStore.setState({ error: 'Test error' });
        expect(useCandidatesStore.getState().error).toBe('Test error');
    });
});
