import { cn } from '@/lib/utils';

export interface EventData {
    id: string;
    title: string;
    startTime: string; // HH:MM format
    endTime: string;
    date: string; // YYYY-MM-DD
    duration: number; // hours
    color: 'green' | 'lime' | 'cyan' | 'purple';
    attendees: string[];
    description?: string;
    status?: 'research' | 'reviews' | 'meeting' | 'task';
    comments?: string;
    videoCallLink?: string;
}

interface EventCardProps {
    event: EventData;
    onClick?: (event: EventData, e: React.MouseEvent) => void;
    style?: React.CSSProperties;
}

const colorVariants = {
    green: 'bg-muted text-foreground hover:bg-primary hover:text-primary-foreground',
    lime: 'bg-[#CCFF00] text-gray-900 hover:bg-[#BBEE00]',
    cyan: 'bg-[#00E5FF] text-gray-900 hover:bg-[#00D4ED]',
    purple: 'bg-[#9B87F5] text-white hover:bg-[#8A76E4]',
};

export function EventCard({ event, onClick, style }: EventCardProps) {
    const visibleAvatars = event.attendees.slice(0, 3);
    const extraCount = event.attendees.length - 3;

    return (
        <div
            onClick={(e) => onClick?.(event, e)}
            style={style}
            className={cn(
                'absolute rounded-xl p-3 cursor-pointer transition-all duration-200',
                'shadow-sm hover:shadow-md hover:scale-[1.02]',
                'flex flex-col justify-between overflow-hidden',
                colorVariants[event.color]
            )}
        >
            {/* Title */}
            <div className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
                {event.title}
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1 text-xs opacity-80 mb-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeWidth="2" d="M12 6v6l4 2" />
                </svg>
                <span>{event.duration.toFixed(2)} hrs</span>
            </div>

            {/* Attendees */}
            {event.attendees.length > 0 && (
                <div className="flex items-center mt-auto">
                    <div className="flex -space-x-2">
                        {visibleAvatars.map((avatar, idx) => (
                            <img
                                key={idx}
                                src={avatar}
                                alt="Attendee"
                                className="w-6 h-6 rounded-full ring-1 ring-white/50"
                            />
                        ))}
                    </div>
                    {extraCount > 0 && (
                        <span className="ml-1 text-xs font-semibold opacity-80">
                            +{extraCount}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
