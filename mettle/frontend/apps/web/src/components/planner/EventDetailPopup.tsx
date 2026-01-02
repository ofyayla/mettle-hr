import { useEffect } from 'react';
import { X, Video, MessageSquare, Calendar, Trash2, Pencil } from 'lucide-react';
import { EventData } from './EventCard';
import { cn } from '@/lib/utils';

interface EventDetailPopupProps {
    event: EventData | null;
    onClose: () => void;
    onEdit?: (event: EventData) => void;
    onDelete?: (eventId: string) => void;
    position?: { top: number; left: number };
}

const statusColors: Record<string, string> = {
    research: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300',
    reviews: 'bg-lime-500/20 text-lime-700 dark:text-lime-300',
    meeting: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
    task: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
};

export function EventDetailPopup({ event, onClose, onEdit, onDelete, position }: EventDetailPopupProps) {
    // ESC key to close popup
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (event) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [event, onClose]);

    if (!event) return null;

    // Format date range
    const formatDateRange = () => {
        const start = new Date(event.date);
        const end = new Date(event.date);
        end.setDate(end.getDate() + Math.ceil(event.duration / 8)); // Approximate multi-day

        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return `${start.toLocaleDateString('en-GB', options)}`;
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* Popup */}
            <div
                className={cn(
                    "fixed z-50 w-80 bg-card/95 backdrop-blur-lg rounded-2xl border border-border/50 shadow-2xl",
                    "animate-in max-h-[80vh] overflow-y-auto scrollbar-hide"
                )}
                style={position ? { top: position.top, left: position.left } : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
                {/* Header */}
                <div className="p-4 border-b border-border/30">
                    <div className="flex items-start justify-between">
                        <h3 className="font-bold text-base pr-4 leading-tight">{event.title}</h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-md hover:bg-muted transition-colors flex-shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Status Badges */}
                    {event.status && (
                        <div className="flex gap-2 mt-3">
                            <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                statusColors[event.status] || 'bg-muted text-muted-foreground'
                            )}>
                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateRange()}</span>
                        <span className="text-xs">• {event.startTime} - {event.endTime}</span>
                    </div>

                    {/* Attendees + Video Call */}
                    <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                            {event.attendees.slice(0, 4).map((avatar, idx) => (
                                <img
                                    key={idx}
                                    src={avatar}
                                    alt="Attendee"
                                    className="w-8 h-8 rounded-full border-2 border-background ring-1 ring-border/50"
                                />
                            ))}
                            {event.attendees.length > 4 && (
                                <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                                    +{event.attendees.length - 4}
                                </div>
                            )}
                        </div>

                        {event.videoCallLink && (
                            <a
                                href={event.videoCallLink}
                                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                            >
                                <Video className="w-3.5 h-3.5" />
                                Join video call
                            </a>
                        )}
                    </div>

                    {/* Comments */}
                    {event.comments && (
                        <div className="bg-muted/50 rounded-xl p-3 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <MessageSquare className="w-3.5 h-3.5" />
                                Comments
                            </div>
                            <p className="text-sm leading-relaxed">{event.comments}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(event)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 border border-primary/30 rounded-xl transition-colors"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(event.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

