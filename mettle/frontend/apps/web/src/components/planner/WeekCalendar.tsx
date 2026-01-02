import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EventCard, EventData } from './EventCard';
import { cn } from '@/lib/utils';

interface WeekCalendarProps {
    weekStart: Date;
    events: EventData[];
    onEventClick: (event: EventData, e: React.MouseEvent) => void;
    onPreviousWeek?: () => void;
    onNextWeek?: () => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM to 6 PM
const HOUR_HEIGHT = 80; // pixels per hour

export function WeekCalendar({ weekStart, events, onEventClick, onPreviousWeek, onNextWeek }: WeekCalendarProps) {
    // Generate weekdays only (Monday-Friday)
    const weekDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < 5; i++) { // Only 5 days (Mon-Fri)
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            days.push({
                date,
                dayName: date.toLocaleDateString('en-US', { weekday: 'long' }), // Full day name
                dayNumber: date.getDate(),
                isToday: isSameDay(date, new Date()),
            });
        }
        return days;
    }, [weekStart]);

    // Group events by day
    const eventsByDay = useMemo(() => {
        const grouped: Record<string, EventData[]> = {};
        events.forEach((event) => {
            const key = event.date;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(event);
        });
        return grouped;
    }, [events]);

    // Calculate event position and height
    // Calculate event position and dimensions handling overlaps
    const getEventStyle = (event: EventData, dayEvents: EventData[]): React.CSSProperties => {
        // Simple overlap detection
        // 1. Find all events that overlap with this one
        const [startHour, startMin] = event.startTime.split(':').map(Number);
        const startVal = startHour * 60 + startMin;
        const endVal = startVal + (event.duration * 60);

        // Filter events that overlap with current event
        const overlapping = dayEvents.filter(e => {
            const [sH, sM] = e.startTime.split(':').map(Number);
            const sV = sH * 60 + sM;
            const eV = sV + (e.duration * 60);
            return (startVal < eV && endVal > sV);
        });

        // 2. Sort them by start time then length (longer first)
        overlapping.sort((a, b) => {
            const [sHa, sMa] = a.startTime.split(':').map(Number);
            const sVa = sHa * 60 + sMa;
            const [sHb, sMb] = b.startTime.split(':').map(Number);
            const sVb = sHb * 60 + sMb;
            if (sVa !== sVb) return sVa - sVb;
            return b.duration - a.duration;
        });

        // 3. Determine column index
        const index = overlapping.findIndex(e => e.id === event.id);
        const total = overlapping.length;

        const topOffset = (startHour - 7) * HOUR_HEIGHT + (startMin / 60) * HOUR_HEIGHT;
        const height = event.duration * HOUR_HEIGHT - 4; // -4 for gap

        const widthPercent = 100 / total;
        const leftPercent = index * widthPercent;

        return {
            top: `${topOffset}px`,
            height: `${Math.max(height, 40)}px`,
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
            zIndex: index + 10,
            position: 'absolute',
            paddingRight: '4px'
        };
    };

    return (
        <div className="flex flex-col h-full bg-card rounded-2xl border border-border/50 overflow-hidden hover-neon-border">
            {/* Header */}
            <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-border/50">
                {/* Navigation and Time Header */}
                <div className="p-2 border-r border-border/50 flex items-center justify-center gap-1 bg-muted/30">
                    <button
                        onClick={onPreviousWeek}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        title="Previous week"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onNextWeek}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        title="Next week"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Day Headers */}
                {weekDays.map((day) => (
                    <div
                        key={day.date.toISOString()}
                        className={cn(
                            "p-3 text-center border-l border-border/50 first:border-l-0",
                            day.isToday && "bg-primary/5"
                        )}
                    >
                        <div className={cn(
                            "text-sm mb-1",
                            day.isToday && "text-primary"
                        )}>
                            <span className="font-light">{day.date.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                            <span className="font-semibold ml-1">{day.date.getDate()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-[80px_repeat(5,1fr)]">
                    {/* Time Column */}
                    <div className="border-r border-border/30 bg-muted/20">
                        {HOURS.map((hour) => (
                            <div
                                key={hour}
                                className="h-20 border-b border-border/20 flex items-start justify-end pr-3 pt-1"
                            >
                                <span className="text-xs text-muted-foreground font-medium">
                                    {hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Day Columns with Events */}
                    {weekDays.map((day, dayIdx) => {
                        const dayKey = formatDateKey(day.date);
                        const dayEvents = eventsByDay[dayKey] || [];

                        return (
                            <div
                                key={dayIdx}
                                className={cn(
                                    "relative border-r border-border/30 last:border-r-0",
                                    day.isToday && "bg-primary/5"
                                )}
                            >
                                {/* Hour Grid Lines */}
                                {HOURS.map((hour) => (
                                    <div
                                        key={hour}
                                        className="h-20 border-b border-border/20"
                                    />
                                ))}

                                {/* Events */}
                                {dayEvents.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        onClick={onEventClick}
                                        style={getEventStyle(event, dayEvents)}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Helper functions
function isSameDay(d1: Date, d2: Date): boolean {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

function formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
}
