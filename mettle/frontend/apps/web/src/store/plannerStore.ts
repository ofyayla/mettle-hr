import { create } from 'zustand';
import { EventData } from '@/components/planner/EventCard';

// Get Monday of the current week
function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
}

// Mock events generator
export function generateMockEvents(weekStart: Date): EventData[] {
    const monday = formatDateKey(weekStart);
    const tuesday = formatDateKey(new Date(weekStart.getTime() + 86400000));
    const wednesday = formatDateKey(new Date(weekStart.getTime() + 86400000 * 2));
    const thursday = formatDateKey(new Date(weekStart.getTime() + 86400000 * 3));
    const friday = formatDateKey(new Date(weekStart.getTime() + 86400000 * 4));

    return [
        {
            id: '1', title: 'Weekly Kickoff Meeting', date: monday,
            startTime: '08:00', endTime: '10:00', duration: 2, color: 'green',
            attendees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'],
            status: 'meeting', videoCallLink: 'https://meet.google.com/abc-xyz',
        },
        {
            id: '2', title: 'Create New Feature Mockups', date: tuesday,
            startTime: '08:30', endTime: '11:30', duration: 3, color: 'green',
            attendees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Riley'],
            status: 'task',
        },
        {
            id: '3', title: 'Results Analysis', date: wednesday,
            startTime: '07:30', endTime: '11:30', duration: 4, color: 'green',
            attendees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor'],
            status: 'research',
        },
        {
            id: '4', title: 'Migrate Database Schema', date: thursday,
            startTime: '09:00', endTime: '12:00', duration: 3, color: 'green',
            attendees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Dev1'],
            status: 'reviews',
        },
        {
            id: '5', title: 'Prototype User Testing', date: wednesday,
            startTime: '12:30', endTime: '14:30', duration: 2, color: 'green',
            attendees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=UX1'],
            status: 'research',
        },
    ];
}

interface PlannerFilters {
    title: string;
    status: string;
    attendees: string;
    date: string;
}

interface PlannerState {
    // View state
    viewMode: 'day' | 'week' | 'month';
    searchQuery: string;
    filters: PlannerFilters;

    // Date navigation
    weekStart: Date;
    currentDate: Date;

    // Events data
    events: EventData[];

    // UI state
    selectedEvent: EventData | null;
    popupPosition: { top: number; left: number } | undefined;
    isAddModalOpen: boolean;
    editingEvent: EventData | null;
    deletingEventId: string | null;

    // Actions - View
    setViewMode: (mode: 'day' | 'week' | 'month') => void;
    setSearchQuery: (query: string) => void;
    setFilters: (filters: Partial<PlannerFilters>) => void;
    clearFilters: () => void;

    // Actions - Navigation
    goToToday: () => void;
    navigatePrevious: () => void;
    navigateNext: () => void;
    setCurrentDate: (date: Date) => void;

    // Actions - Events
    addEvent: (event: Omit<EventData, 'id'>) => void;
    updateEvent: (event: EventData) => void;
    deleteEvent: (id: string) => void;

    // Actions - UI
    selectEvent: (event: EventData | null, position?: { top: number; left: number }) => void;
    openAddModal: (editEvent?: EventData | null) => void;
    closeAddModal: () => void;
    openDeleteModal: (eventId: string) => void;
    closeDeleteModal: () => void;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
    // Initial state
    viewMode: 'week',
    searchQuery: '',
    filters: { title: '', status: 'all', attendees: '', date: '' },
    weekStart: getWeekStart(new Date()),
    currentDate: new Date(),
    events: generateMockEvents(getWeekStart(new Date())),
    selectedEvent: null,
    popupPosition: undefined,
    isAddModalOpen: false,
    editingEvent: null,
    deletingEventId: null,

    // View actions
    setViewMode: (mode) => set({ viewMode: mode }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),
    clearFilters: () => set({
        filters: { title: '', status: 'all', attendees: '', date: '' }
    }),

    // Navigation actions
    goToToday: () => {
        const today = new Date();
        const todayWeekStart = getWeekStart(today);
        set({
            currentDate: today,
            weekStart: todayWeekStart,
            events: generateMockEvents(todayWeekStart)
        });
    },

    navigatePrevious: () => {
        const { viewMode, weekStart, currentDate } = get();
        if (viewMode === 'week') {
            const newStart = new Date(weekStart);
            newStart.setDate(weekStart.getDate() - 7);
            set({ weekStart: newStart, events: generateMockEvents(newStart) });
        } else if (viewMode === 'day') {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() - 1);
            set({ currentDate: newDate });
        } else {
            const newDate = new Date(currentDate);
            newDate.setMonth(currentDate.getMonth() - 1);
            set({ currentDate: newDate });
        }
    },

    navigateNext: () => {
        const { viewMode, weekStart, currentDate } = get();
        if (viewMode === 'week') {
            const newStart = new Date(weekStart);
            newStart.setDate(weekStart.getDate() + 7);
            set({ weekStart: newStart, events: generateMockEvents(newStart) });
        } else if (viewMode === 'day') {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() + 1);
            set({ currentDate: newDate });
        } else {
            const newDate = new Date(currentDate);
            newDate.setMonth(currentDate.getMonth() + 1);
            set({ currentDate: newDate });
        }
    },

    setCurrentDate: (date) => set({ currentDate: date, viewMode: 'day' }),

    // Event actions
    addEvent: (eventData) => {
        const newEvent: EventData = {
            ...eventData,
            id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({ events: [...state.events, newEvent] }));
    },

    updateEvent: (updatedEvent) => set((state) => ({
        events: state.events.map((e) => e.id === updatedEvent.id ? updatedEvent : e),
        editingEvent: null
    })),

    deleteEvent: (id) => set((state) => ({
        events: state.events.filter((e) => e.id !== id),
        deletingEventId: null
    })),

    // UI actions
    selectEvent: (event, position) => set({
        selectedEvent: event,
        popupPosition: position
    }),

    openAddModal: (editEvent = null) => set({
        isAddModalOpen: true,
        editingEvent: editEvent,
        selectedEvent: null
    }),

    closeAddModal: () => set({
        isAddModalOpen: false,
        editingEvent: null
    }),

    openDeleteModal: (eventId) => set({
        deletingEventId: eventId,
        selectedEvent: null
    }),

    closeDeleteModal: () => set({ deletingEventId: null })
}));
