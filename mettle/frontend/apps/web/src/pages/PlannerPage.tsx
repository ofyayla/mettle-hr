import { useMemo } from 'react';
import { PlannerHeader } from '@/components/planner/PlannerHeader';
import { WeekCalendar } from '@/components/planner/WeekCalendar';
import { DayCalendar } from '@/components/planner/DayCalendar';
import { MonthCalendar } from '@/components/planner/MonthCalendar';
import { EventDetailPopup } from '@/components/planner/EventDetailPopup';
import { AddEventModal } from '@/components/planner/AddEventModal';
import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal';
import { EventData } from '@/components/planner/EventCard';
import { usePlannerStore } from '@/store';

export function PlannerPage() {
    // Use centralized store
    const {
        viewMode, setViewMode,
        searchQuery, setSearchQuery,
        filters, setFilters, clearFilters,
        weekStart, currentDate, setCurrentDate,
        events,
        selectedEvent, popupPosition, selectEvent,
        isAddModalOpen, openAddModal, closeAddModal,
        editingEvent,
        deletingEventId, openDeleteModal, closeDeleteModal,
        goToToday, navigatePrevious, navigateNext,
        addEvent, updateEvent, deleteEvent
    } = usePlannerStore();

    // Filtered events with useMemo
    const filteredEvents = useMemo(() => {
        let result = events;

        if (searchQuery) {
            result = result.filter((event) =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

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

    // Event click handler with position calculation
    const handleEventClick = (event: EventData, e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const popupWidth = 320;
        const estimatedPopupHeight = 450;

        let left = rect.right + 10;
        if (left + popupWidth > windowWidth) {
            left = rect.left - popupWidth - 10;
        }
        if (left < 10) left = 10;

        let top = rect.top + (rect.height / 2) - (estimatedPopupHeight / 2);
        if (top < 20) top = 20;
        if (top + estimatedPopupHeight > windowHeight - 20) {
            top = windowHeight - estimatedPopupHeight - 20;
        }

        selectEvent(event, { top, left });
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters({ [key]: value });
    };

    // Get event title for delete modal
    const deletingEvent = events.find((e) => e.id === deletingEventId);

    return (
        <div className="flex-1 p-8 overflow-hidden h-full flex flex-col animate-in">
            <PlannerHeader
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                onAddEvent={() => openAddModal()}
                onToday={goToToday}
            />

            <div className="flex-1 mt-6 min-h-0 flex flex-col">
                {viewMode === 'day' && (
                    <DayCalendar
                        currentDate={currentDate}
                        events={filteredEvents}
                        onEventClick={handleEventClick}
                        onPreviousDay={navigatePrevious}
                        onNextDay={navigateNext}
                    />
                )}
                {viewMode === 'week' && (
                    <WeekCalendar
                        weekStart={weekStart}
                        events={filteredEvents}
                        onEventClick={handleEventClick}
                        onPreviousWeek={navigatePrevious}
                        onNextWeek={navigateNext}
                    />
                )}
                {viewMode === 'month' && (
                    <MonthCalendar
                        currentDate={currentDate}
                        events={filteredEvents}
                        onEventClick={handleEventClick}
                        onPreviousMonth={navigatePrevious}
                        onNextMonth={navigateNext}
                        onDayClick={setCurrentDate}
                    />
                )}
            </div>

            <EventDetailPopup
                event={selectedEvent}
                onClose={() => selectEvent(null)}
                onEdit={(event) => openAddModal(event)}
                onDelete={(id) => openDeleteModal(id)}
                position={popupPosition}
            />

            <DeleteConfirmationModal
                isOpen={!!deletingEventId}
                onClose={closeDeleteModal}
                onConfirm={() => deletingEventId && deleteEvent(deletingEventId)}
                title="Delete Event"
                description={`Are you sure you want to delete "${deletingEvent?.title || ''}"? This action cannot be undone.`}
            />

            <AddEventModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onAdd={addEvent}
                onUpdate={updateEvent}
                initialData={editingEvent}
            />
        </div>
    );
}
