import { describe, it, expect, beforeEach } from 'vitest';
import { usePlannerStore, generateMockEvents } from '../plannerStore';

describe('usePlannerStore', () => {
    beforeEach(() => {
        usePlannerStore.setState({
            viewMode: 'week',
            searchQuery: '',
            filters: { title: '', status: 'all', attendees: '', date: '' },
            weekStart: new Date(),
            currentDate: new Date(),
            events: [],
            selectedEvent: null,
            popupPosition: undefined,
            isAddModalOpen: false,
            editingEvent: null,
            deletingEventId: null
        });
    });

    it('should initialize with default values', () => {
        const state = usePlannerStore.getState();
        expect(state.viewMode).toBe('week');
        expect(state.searchQuery).toBe('');
        expect(state.isAddModalOpen).toBe(false);
    });

    it('should set view mode', () => {
        const store = usePlannerStore.getState();
        store.setViewMode('day');
        expect(usePlannerStore.getState().viewMode).toBe('day');
    });

    it('should set search query', () => {
        const store = usePlannerStore.getState();
        store.setSearchQuery('meeting');
        expect(usePlannerStore.getState().searchQuery).toBe('meeting');
    });

    it('should set filters', () => {
        const store = usePlannerStore.getState();
        store.setFilters({ status: 'meeting' });
        expect(usePlannerStore.getState().filters.status).toBe('meeting');
    });

    it('should clear filters', () => {
        usePlannerStore.setState({
            filters: { title: 'test', status: 'task', attendees: 'john', date: '2025-01-01' }
        });

        const store = usePlannerStore.getState();
        store.clearFilters();

        const state = usePlannerStore.getState();
        expect(state.filters.title).toBe('');
        expect(state.filters.status).toBe('all');
    });

    it('should add event', () => {
        const store = usePlannerStore.getState();
        store.addEvent({
            title: 'New Meeting',
            date: '2025-01-15',
            startTime: '10:00',
            endTime: '11:00',
            duration: 1,
            color: 'green',
            attendees: [],
            status: 'meeting'
        });

        const state = usePlannerStore.getState();
        expect(state.events.length).toBe(1);
        expect(state.events[0].title).toBe('New Meeting');
    });

    it('should delete event', () => {
        usePlannerStore.setState({
            events: [{ id: 'e1', title: 'Test', date: '2025-01-15', startTime: '10:00', endTime: '11:00', duration: 1, color: 'green', attendees: [], status: 'task' }]
        });

        const store = usePlannerStore.getState();
        store.deleteEvent('e1');

        expect(usePlannerStore.getState().events.length).toBe(0);
    });

    it('should open/close add modal', () => {
        const store = usePlannerStore.getState();

        store.openAddModal();
        expect(usePlannerStore.getState().isAddModalOpen).toBe(true);

        store.closeAddModal();
        expect(usePlannerStore.getState().isAddModalOpen).toBe(false);
    });

    it('should generate mock events', () => {
        const events = generateMockEvents(new Date());
        expect(events.length).toBeGreaterThan(0);
        expect(events[0]).toHaveProperty('title');
        expect(events[0]).toHaveProperty('date');
    });
});
