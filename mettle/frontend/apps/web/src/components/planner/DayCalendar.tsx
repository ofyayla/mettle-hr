import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EventCard, EventData } from './EventCard';
import { cn } from '@/lib/utils';

interface DayCalendarProps {
    currentDate: Date;
    events: EventData[];
    onEventClick: (event: EventData, e: React.MouseEvent) => void;
    onPreviousDay?: () => void;
    onNextDay?: () => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM to 6 PM
const HOUR_HEIGHT = 80; // pixels per hour

export function DayCalendar({ currentDate, events, onEventClick, onPreviousDay, onNextDay }: DayCalendarProps) {
    const dateKey = currentDate.toISOString().split('T')[0];
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNumber = currentDate.getDate();
    const isToday = isSameDay(currentDate, new Date());

    // Filter events for this day
    const dayEvents = useMemo(() => {
        return events.filter((event) => event.date === dateKey);
    }, [events, dateKey]);

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

        // 2. Sort them by start time then length
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
            <div className="grid grid-cols-[80px_1fr] border-b border-border/50">
                {/* Navigation */}
                <div className="p-2 bg-muted/30 border-r border-border/30 flex items-center justify-center gap-1">
                    {onPreviousDay && (
                        <button
                            onClick={onPreviousDay}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            title="Previous day"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    )}
                    {onNextDay && (
                        <button
                            onClick={onNextDay}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            title="Next day"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Day Header */}
                <div className={cn(
                    "p-3 text-center",
                    isToday && "bg-primary/5"
                )}>
                    <div className={cn(
                        "text-sm",
                        isToday && "text-primary"
                    )}>
                        <span className="font-light">{dayName}</span>
                        <span className="font-semibold ml-1">{dayNumber}</span>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-[80px_1fr]">
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

                    {/* Day Column with Events */}
                    <div className={cn(
                        "relative",
                        isToday && "bg-primary/5"
                    )}>
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
                </div>
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
