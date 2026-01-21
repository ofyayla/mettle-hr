import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../uiStore';

describe('useUIStore', () => {
    beforeEach(() => {
        useUIStore.setState({
            openModals: new Set(),
            deleteTarget: null,
            editingId: null,
            viewMode: 'grid',
            searchQuery: '',
            isFilterPanelOpen: false
        });
    });

    it('should initialize with default values', () => {
        const state = useUIStore.getState();
        expect(state.openModals.size).toBe(0);
        expect(state.viewMode).toBe('grid');
        expect(state.searchQuery).toBe('');
    });

    it('should open modal', () => {
        const store = useUIStore.getState();
        store.openModal('addCandidate');

        const updatedState = useUIStore.getState();
        expect(updatedState.openModals.has('addCandidate')).toBe(true);
    });

    it('should open modal with editing id', () => {
        const store = useUIStore.getState();
        store.openModal('editCandidate', 'candidate-123');

        const updatedState = useUIStore.getState();
        expect(updatedState.openModals.has('editCandidate')).toBe(true);
        expect(updatedState.editingId).toBe('candidate-123');
    });

    it('should close modal', () => {
        const store = useUIStore.getState();
        store.openModal('addCandidate');
        store.closeModal('addCandidate');

        const updatedState = useUIStore.getState();
        expect(updatedState.openModals.has('addCandidate')).toBe(false);
    });

    it('should close all modals', () => {
        const store = useUIStore.getState();
        store.openModal('addCandidate');
        store.openModal('createJob');
        store.closeAllModals();

        const updatedState = useUIStore.getState();
        expect(updatedState.openModals.size).toBe(0);
        expect(updatedState.editingId).toBeNull();
    });

    it('should set view mode', () => {
        const store = useUIStore.getState();
        store.setViewMode('list');

        expect(useUIStore.getState().viewMode).toBe('list');
    });

    it('should set search query', () => {
        const store = useUIStore.getState();
        store.setSearchQuery('test query');

        expect(useUIStore.getState().searchQuery).toBe('test query');
    });

    it('should toggle filter panel', () => {
        const store = useUIStore.getState();
        store.toggleFilterPanel();
        expect(useUIStore.getState().isFilterPanelOpen).toBe(true);

        store.toggleFilterPanel();
        expect(useUIStore.getState().isFilterPanelOpen).toBe(false);
    });

    it('should set delete target', () => {
        const store = useUIStore.getState();
        store.setDeleteTarget({
            type: 'candidate',
            id: 'test-123',
            name: 'Test Candidate'
        });

        const state = useUIStore.getState();
        expect(state.deleteTarget).not.toBeNull();
        expect(state.deleteTarget?.id).toBe('test-123');
        expect(state.deleteTarget?.type).toBe('candidate');
    });
});
