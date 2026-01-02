import { useState, useMemo } from 'react';
import { PlannerHeader } from '@/components/planner/PlannerHeader';
import { WeekCalendar } from '@/components/planner/WeekCalendar';
import { DayCalendar } from '@/components/planner/DayCalendar';
import { MonthCalendar } from '@/components/planner/MonthCalendar';
import { EventDetailPopup } from '@/components/planner/EventDetailPopup';
import { AddEventModal } from '@/components/planner/AddEventModal';
import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal';
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

// Format week label


// Generate date key
function formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
}

// Mock events data
const generateMockEvents = (weekStart: Date): EventData[] => {
    const monday = formatDateKey(weekStart);
    const tuesday = formatDateKey(new Date(weekStart.getTime() + 86400000));
    const wednesday = formatDateKey(new Date(weekStart.getTime() + 86400000 * 2));
    const thursday = formatDateKey(new Date(weekStart.getTime() + 86400000 * 3));
    const friday = formatDateKey(new Date(weekStart.getTime() + 86400000 * 4));

    return [
        {
            id: '1',
            title: 'Weekly Kickoff Meeting',
            date: monday,
            startTime: '08:00',
            endTime: '10:00',
            duration: 2,
            color: 'green',
            attendees: [
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
            ],
            status: 'meeting',
            videoCallLink: 'https://meet.google.com/abc-xyz',
            comments: 'Weekly team sync to discuss priorities and blockers.',
        },
        {
            id: '2',
            title: 'Create New Feature Mockups',
            date: tuesday,
            startTime: '08:30',
            endTime: '11:30',
            duration: 3,
            color: 'green',
            attendees: [
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
            ],
            status: 'task',
        },
        {
            id: '3',
            title: 'Results Analysis',
            date: wednesday,
            startTime: '07:30',
            endTime: '11:30',
            duration: 4,
            color: 'green',
            attendees: [
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
            ],
            status: 'research',
            comments: 'Q4 performance analysis deep dive.',
        },
        {
            id: '4',
            title: 'Migrate Database Schema',
            date: thursday,
            startTime: '09:00',
            endTime: '12:00',
            duration: 3,
            color: 'green',
            attendees: [
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev1',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev2',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev3',
            ],
            status: 'reviews',
            comments: 'Waiting for final approval on the new field definitions before running the production script.',
            videoCallLink: 'https://meet.google.com/db-migration',
        },
        {
            id: '5',
            title: 'Develop New Pricing Logic',
            date: tuesday,
            startTime: '11:00',
            endTime: '13:30',
            duration: 2.5,
            color: 'green',
            attendees: [
                'https://api.dicebear.com/7.x/avataaars/svg?seed=PM1',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=PM2',
            ],
            status: 'task',
        },
        {
            id: '6',
            title: 'Prototype User Testing',
            date: wednesday,
            startTime: '12:30',
            endTime: '14:30',
            duration: 2,
            color: 'green',
            attendees: [
                'https://api.dicebear.com/7.x/avataaars/svg?seed=UX1',
            ],
            status: 'research',
        },
        {
            id: '7',
            title: 'Prepare Q4 Financial Reports',
            date: thursday,
            startTime: '13:00',
            endTime: '16:00',
            duration: 3,
            color: 'green',
            attendees: [
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Fin1',
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Fin2',
            ],
            status: 'task',
        },
        {
            id: '8',
            title: 'Bug Fix: Cart Checkout',
            date: friday,
            startTime: '14:00',
            endTime: '16:00',
            duration: 2,
            color: 'green',
            attendees: [
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Bug1',
            ],
            status: 'task',
        },
        {
            id: '9',
            title: 'Final UX Audit Prep',
            date: thursday,
            startTime: '08:00',
            endTime: '09:30',
            duration: 1.5,
            color: 'green',
            attendees: [
                'https://api.dicebear.com/7.x/avataaars/svg?seed=UX2',
            ],
            status: 'research',
        },
    ];
};

export function PlannerPage() {
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
    const [searchQuery, setSearchQuery] = useState('');
    const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | undefined>(undefined);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [events, setEvents] = useState<EventData[]>(() => generateMockEvents(getWeekStart(new Date())));
    const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
    const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
    const [filters, setFilters] = useState({
        title: '',
        status: 'all',
        attendees: '',
        date: ''
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            title: '',
            status: 'all',
            attendees: '',
            date: ''
        });
    };

    // Filter events by search and status
    const filteredEvents = useMemo(() => {
        let result = events;

        // Search Query (Global Search) - keeping this if we want to keep the top bar search separate or synced
        if (searchQuery) {
            result = result.filter((event) =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply Panel Filters
        if (filters.title) {
            result = result.filter((event) =>
                event.title.toLowerCase().includes(filters.title.toLowerCase())
            );
        }

        if (filters.status !== 'all') {
            result = result.filter((event) => event.status === filters.status);
        }

        if (filters.attendees) {
            result = result.filter((event) =>
                event.attendees.some(a => a.toLowerCase().includes(filters.attendees.toLowerCase()))
            );
        }

        if (filters.date) {
            result = result.filter((event) => event.date === filters.date);
        }

        return result;
    }, [events, searchQuery, filters]);

    const handleEventClick = (event: EventData, e: React.MouseEvent) => {
        // Calculate position based on the clicked element
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const popupWidth = 320;
        const estimatedPopupHeight = 450; // Estimate max height

        // Horizontal Positioning
        let left = rect.right + 10;
        if (left + popupWidth > windowWidth) {
            // Try left side
            left = rect.left - popupWidth - 10;
        }
        // If still off screen (e.g. mobile), center smoothly or clamp
        if (left < 10) left = 10;

        // Vertical Positioning
        // Attempt to center vertically relative to event
        let top = rect.top + (rect.height / 2) - (estimatedPopupHeight / 2);

        // Clamp to edges
        if (top < 20) top = 20;
        if (top + estimatedPopupHeight > windowHeight - 20) {
            top = windowHeight - estimatedPopupHeight - 20;
        }

        setPopupPosition({ top, left });
        setSelectedEvent(event);
    };

    // Week navigation handlers
    const handlePreviousWeek = () => {
        const newStart = new Date(weekStart);
        newStart.setDate(weekStart.getDate() - 7);
        setWeekStart(newStart);
        setEvents(generateMockEvents(newStart));
    };

    const handleNextWeek = () => {
        const newStart = new Date(weekStart);
        newStart.setDate(weekStart.getDate() + 7);
        setWeekStart(newStart);
        setEvents(generateMockEvents(newStart));
    };

    // Day navigation handlers
    const handlePreviousDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    // Month navigation handlers
    const handlePreviousMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    // Handle day click in month view - switch to day view
    const handleDayClick = (date: Date) => {
        setCurrentDate(date);
        setViewMode('day');
    };

    const handleToday = () => {
        const today = new Date();
        setCurrentDate(today);
        const todayWeekStart = getWeekStart(today);
        setWeekStart(todayWeekStart);
        setEvents(generateMockEvents(todayWeekStart));
    };

    // Add event handler
    const handleAddEvent = (eventData: Omit<EventData, 'id'>) => {
        const newEvent: EventData = {
            ...eventData,
            id: Math.random().toString(36).substr(2, 9),
        };
        setEvents((prev) => [...prev, newEvent]);
    };

    // Edit event handlers
    const handleEditClick = (event: EventData) => {
        setEditingEvent(event);
        setSelectedEvent(null); // Close detail popup
        setIsAddModalOpen(true);
    };

    const handleUpdateEvent = (updatedEvent: EventData) => {
        setEvents((prev) => prev.map((e) => e.id === updatedEvent.id ? updatedEvent : e));
        setEditingEvent(null);
    };

    // Delete event handlers
    const handleDeleteClick = (eventId: string) => {
        setDeletingEventId(eventId);
        setSelectedEvent(null); // Close detail popup
    };

    const confirmDeleteEvent = () => {
        if (deletingEventId) {
            setEvents((prev) => prev.filter((e) => e.id !== deletingEventId));
            setDeletingEventId(null);
        }
    };

    // Get event title for delete modal
    const deletingEvent = events.find((e) => e.id === deletingEventId);

    return (
        <div className="flex-1 p-8 overflow-hidden h-full flex flex-col animate-in">
            {/* Header */}
            <PlannerHeader
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                onAddEvent={() => {
                    setEditingEvent(null);
                    setIsAddModalOpen(true);
                }}
                onToday={handleToday}
            />

            {/* Calendar */}
            <div className="flex-1 mt-6 min-h-0 flex flex-col">
                {viewMode === 'day' && (
                    <DayCalendar
                        currentDate={currentDate}
                        events={filteredEvents}
                        onEventClick={handleEventClick}
                        onPreviousDay={handlePreviousDay}
                        onNextDay={handleNextDay}
                    />
                )}
                {viewMode === 'week' && (
                    <WeekCalendar
                        weekStart={weekStart}
                        events={filteredEvents}
                        onEventClick={handleEventClick}
                        onPreviousWeek={handlePreviousWeek}
                        onNextWeek={handleNextWeek}
                    />
                )}
                {viewMode === 'month' && (
                    <MonthCalendar
                        currentDate={currentDate}
                        events={filteredEvents}
                        onEventClick={handleEventClick}
                        onPreviousMonth={handlePreviousMonth}
                        onNextMonth={handleNextMonth}
                        onDayClick={handleDayClick}
                    />
                )}
            </div>

            {/* Event Detail Popup */}
            <EventDetailPopup
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                position={popupPosition}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={!!deletingEventId}
                onClose={() => setDeletingEventId(null)}
                onConfirm={confirmDeleteEvent}
                title="Delete Event"
                description={`Are you sure you want to delete "${deletingEvent?.title || ''}"? This action cannot be undone.`}
            />

            {/* Add/Edit Event Modal */}
            <AddEventModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingEvent(null);
                }}
                onAdd={handleAddEvent}
                onUpdate={handleUpdateEvent}
                initialData={editingEvent}
            />
        </div>
    );
}

