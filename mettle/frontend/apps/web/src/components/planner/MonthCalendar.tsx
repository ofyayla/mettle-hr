import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EventData } from './EventCard';
import { cn } from '@/lib/utils';

interface MonthCalendarProps {
    currentDate: Date;
    events: EventData[];
    onEventClick: (event: EventData, e: React.MouseEvent) => void;
    onPreviousMonth?: () => void;
    onNextMonth?: () => void;
    onDayClick?: (date: Date) => void;
}

export function MonthCalendar({ currentDate, events, onEventClick, onPreviousMonth, onNextMonth, onDayClick }: MonthCalendarProps) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

        const days: { date: Date; isCurrentMonth: boolean; isToday: boolean }[] = [];

        // Previous month days
        const prevMonth = new Date(year, month, 0);
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, prevMonth.getDate() - i);
            days.push({ date, isCurrentMonth: false, isToday: false });
        }

        // Current month days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            days.push({
                date,
                isCurrentMonth: true,
                isToday: isSameDay(date, today),
            });
        }

        // Next month days to fill grid
        const remaining = 42 - days.length; // 6 rows x 7 days
        for (let i = 1; i <= remaining; i++) {
            const date = new Date(year, month + 1, i);
            days.push({ date, isCurrentMonth: false, isToday: false });
        }

        return days;
    }, [year, month]);

    // Group events by date
    const eventsByDate = useMemo(() => {
        const grouped: Record<string, EventData[]> = {};
        events.forEach((event) => {
            if (!grouped[event.date]) grouped[event.date] = [];
            grouped[event.date].push(event);
        });
        return grouped;
    }, [events]);

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="flex flex-col h-full bg-card rounded-2xl border border-border/50 overflow-hidden hover-neon-border">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
                <div className="flex items-center gap-2">
                    {onPreviousMonth && (
                        <button
                            onClick={onPreviousMonth}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            title="Previous month"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    )}
                    {onNextMonth && (
                        <button
                            onClick={onNextMonth}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            title="Next month"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <h2 className="text-lg font-semibold">{monthName}</h2>
                <div className="w-16" /> {/* Spacer for symmetry */}
            </div>

            {/* Week Day Headers */}
            <div className="grid grid-cols-7 border-b border-border/50">
                {weekDays.map((day) => (
                    <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 grid-rows-6 flex-1">
                {calendarDays.map((day, index) => {
                    const dateKey = day.date.toISOString().split('T')[0];
                    const dayEvents = eventsByDate[dateKey] || [];

                    return (
                        <div
                            key={index}
                            onClick={() => onDayClick?.(day.date)}
                            className={cn(
                                "p-1 border-b border-r border-border/20 cursor-pointer hover:bg-muted/50 transition-colors",
                                !day.isCurrentMonth && "bg-muted/20 text-muted-foreground",
                                day.isToday && "bg-primary/5"
                            )}
                        >
                            <div className={cn(
                                "text-sm font-medium mb-1",
                                day.isToday && "text-primary"
                            )}>
                                {day.date.getDate()}
                            </div>
                            <div className="space-y-0.5">
                                {dayEvents.slice(0, 3).map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEventClick(event, e);
                                        }}
                                        className={cn(
                                            "text-xs px-1.5 py-0.5 rounded truncate cursor-pointer",
                                            event.color === 'green' && "bg-primary text-primary-foreground",
                                            event.color === 'purple' && "bg-[#9B87F5] text-white",
                                            event.color === 'cyan' && "bg-[#00E5FF] text-gray-900",
                                            event.color === 'lime' && "bg-[#CCFF00] text-gray-900"
                                        )}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                                {dayEvents.length > 3 && (
                                    <div className="text-xs text-muted-foreground px-1">
                                        +{dayEvents.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function isSameDay(d1: Date, d2: Date): boolean {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}
