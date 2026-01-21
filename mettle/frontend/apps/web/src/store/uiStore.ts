import { create } from 'zustand';

type ModalType =
    | 'addCandidate'
    | 'editCandidate'
    | 'deleteCandidate'
    | 'candidateProfile'
    | 'createJob'
    | 'editJob'
    | 'deleteJob'
    | 'jobDetails'
    | 'addEvent'
    | 'deleteEvent';

interface DeleteTarget {
    type: 'candidate' | 'job' | 'event';
    id: string;
    name?: string;
}

interface UIState {
    // Modal states
    openModals: Set<ModalType>;
    deleteTarget: DeleteTarget | null;
    editingId: string | null;

    // View states
    viewMode: 'grid' | 'list';

    // Filter states
    searchQuery: string;
    isFilterPanelOpen: boolean;

    // Actions
    openModal: (modal: ModalType, editingId?: string) => void;
    closeModal: (modal: ModalType) => void;
    closeAllModals: () => void;
    setDeleteTarget: (target: DeleteTarget | null) => void;
    setViewMode: (mode: 'grid' | 'list') => void;
    setSearchQuery: (query: string) => void;
    toggleFilterPanel: () => void;
    setFilterPanelOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    openModals: new Set(),
    deleteTarget: null,
    editingId: null,
    viewMode: 'grid',
    searchQuery: '',
    isFilterPanelOpen: false,

    openModal: (modal, editingId) => {
        set((state) => {
            const newModals = new Set(state.openModals);
            newModals.add(modal);
            return { openModals: newModals, editingId: editingId ?? state.editingId };
        });
    },

    closeModal: (modal) => {
        set((state) => {
            const newModals = new Set(state.openModals);
            newModals.delete(modal);
            // Clear editing ID if closing edit modals
            const editingId = modal.includes('edit') ? null : state.editingId;
            return { openModals: newModals, editingId };
        });
    },

    closeAllModals: () => {
        set({ openModals: new Set(), editingId: null, deleteTarget: null });
    },

    setDeleteTarget: (target) => {
        set({ deleteTarget: target });
    },

    setViewMode: (mode) => {
        set({ viewMode: mode });
    },

    setSearchQuery: (query) => {
        set({ searchQuery: query });
    },

    toggleFilterPanel: () => {
        set((state) => ({ isFilterPanelOpen: !state.isFilterPanelOpen }));
    },

    setFilterPanelOpen: (open) => {
        set({ isFilterPanelOpen: open });
    },
}));

// Selector helpers for common checks
export const useIsModalOpen = (modal: ModalType) =>
    useUIStore((state) => state.openModals.has(modal));
