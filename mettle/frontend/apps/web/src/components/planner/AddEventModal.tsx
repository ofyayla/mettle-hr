import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Plus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventData } from './EventCard';

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (event: Omit<EventData, 'id'>) => void;
    onUpdate?: (event: EventData) => void;
    initialData?: EventData | null;
    selectedDate?: Date;
}

const DURATION_OPTIONS = [
    '30m', '45m', '1h', '1h 30m', '1h 45m', '2h', '2h 30m', '3h', '4h'
];

const REMINDER_OPTIONS = [
    'No reminder',
    '5 minutes before',
    '15 minutes before',
    '30 minutes before',
    '1 hour before event',
    '1 day before',
];

const MOCK_GUESTS = [
    { id: '1', name: 'Sarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: '2', name: 'Mike', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    { id: '3', name: 'Anna', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna' },
];

// Helper to convert hours to duration string
function hoursToDuration(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

export function AddEventModal({ isOpen, onClose, onAdd, onUpdate, initialData, selectedDate }: AddEventModalProps) {
    const isEditMode = !!initialData;

    const [title, setTitle] = useState('');
    const [showDescription, setShowDescription] = useState(false);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('14:00');
    const [duration, setDuration] = useState('1h 45m');
    const [location, setLocation] = useState('');
    const [showMeetingRoom, setShowMeetingRoom] = useState(false);
    const [meetingRoom, setMeetingRoom] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guests, setGuests] = useState(MOCK_GUESTS);
    const [guestMethod, setGuestMethod] = useState<'email' | 'asana'>('email');
    const [reminder, setReminder] = useState('1 hour before event');

    // Initialize form with initialData when editing
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || '');
            setShowDescription(!!initialData.description);
            setDate(initialData.date);
            setTime(initialData.startTime);
            setDuration(hoursToDuration(initialData.duration));
            setGuests(initialData.attendees.map((avatar, i) => ({
                id: String(i),
                name: `Guest ${i + 1}`,
                avatar,
            })));
        } else {
            // Reset for add mode
            setTitle('');
            setDescription('');
            setShowDescription(false);
            setDate(selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]);
            setTime('14:00');
            setDuration('1h 45m');
            setLocation('');
            setMeetingRoom('');
            setGuestEmail('');
            setGuests(MOCK_GUESTS);
        }
    }, [initialData, selectedDate, isOpen]);

    // ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Parse duration string to hours
    const parseDuration = (dur: string): number => {
        let hours = 0;
        const hMatch = dur.match(/(\d+)h/);
        const mMatch = dur.match(/(\d+)m/);
        if (hMatch) hours += parseInt(hMatch[1]);
        if (mMatch) hours += parseInt(mMatch[1]) / 60;
        return hours || 1;
    };

    // Calculate end time
    const calculateEndTime = (): string => {
        const [hour, min] = time.split(':').map(Number);
        const durationHours = parseDuration(duration);
        const endMinutes = hour * 60 + min + durationHours * 60;
        const endHour = Math.floor(endMinutes / 60) % 24;
        const endMin = Math.floor(endMinutes % 60);
        return `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
    };

    const handleAddGuest = () => {
        if (guestEmail.trim()) {
            const newGuest = {
                id: Math.random().toString(36).substr(2, 9),
                name: guestEmail.split('@')[0],
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${guestEmail}`,
            };
            setGuests([...guests, newGuest]);
            setGuestEmail('');
        }
    };

    const handleRemoveGuest = (guestId: string) => {
        setGuests(guests.filter(g => g.id !== guestId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const endTime = calculateEndTime();
        const durationHours = parseDuration(duration);

        const eventData = {
            title,
            date,
            startTime: time,
            endTime,
            duration: durationHours,
            color: initialData?.color || 'green' as const,
            description,
            attendees: guests.map(g => g.avatar),
            status: initialData?.status || 'task' as const,
        };

        if (isEditMode && initialData && onUpdate) {
            onUpdate({ ...eventData, id: initialData.id });
        } else {
            onAdd(eventData);
        }

        onClose();
    };

    // Format date for display
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-card rounded-2xl border border-border/50 shadow-2xl animate-in">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 pb-4">
                        <h2 className="text-lg font-bold">{isEditMode ? 'Edit Event' : 'Add Event'}</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-5">
                        {/* Title Section */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Title</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Event title"
                                    required
                                    className="flex-1 px-4 py-2.5 bg-muted/30 border border-border/50 rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                                {!showDescription && (
                                    <button
                                        type="button"
                                        onClick={() => setShowDescription(true)}
                                        className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted/30 border border-border/50 rounded-xl transition-colors whitespace-nowrap"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add description
                                    </button>
                                )}
                            </div>
                            {showDescription && (
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add event description..."
                                    rows={2}
                                    className="w-full mt-2 px-4 py-2.5 bg-muted/30 border border-border/50 rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                                />
                            )}
                        </div>

                        {/* Date, Time, Duration Row */}
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-2">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                        className="w-full pl-9 pr-3 py-2.5 bg-muted/30 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        required
                                        className="w-full pl-9 pr-3 py-2.5 bg-muted/30 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Duration</label>
                                <div className="relative">
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-muted/30 border border-border/50 rounded-xl text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                                    >
                                        {DURATION_OPTIONS.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Location</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Location name"
                                        className="w-full pl-9 pr-3 py-2.5 bg-muted/30 border border-border/50 rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                                    />
                                </div>
                                {!showMeetingRoom && (
                                    <button
                                        type="button"
                                        onClick={() => setShowMeetingRoom(true)}
                                        className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted/30 border border-border/50 rounded-xl transition-colors whitespace-nowrap"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Set meeting room
                                    </button>
                                )}
                            </div>
                            {showMeetingRoom && (
                                <input
                                    type="text"
                                    value={meetingRoom}
                                    onChange={(e) => setMeetingRoom(e.target.value)}
                                    placeholder="Meeting room name"
                                    className="w-full mt-2 px-4 py-2.5 bg-muted/30 border border-border/50 rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                            )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-dashed border-border/50" />

                        {/* Add Guests Section */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Add guests</label>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={guestEmail}
                                    onChange={(e) => setGuestEmail(e.target.value)}
                                    placeholder="Guest email"
                                    className="flex-1 px-4 py-2.5 bg-muted/30 border border-border/50 rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddGuest}
                                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted/30 border border-border/50 rounded-xl transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add
                                </button>
                            </div>

                            {/* Guest Avatars */}
                            {guests.length > 0 && (
                                <div className="flex items-center gap-2 mt-3">
                                    <div className="flex -space-x-2">
                                        {guests.slice(0, 3).map((guest) => (
                                            <div key={guest.id} className="relative group">
                                                <img
                                                    src={guest.avatar}
                                                    alt={guest.name}
                                                    className="w-10 h-10 rounded-full border-2 border-background"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveGuest(guest.id)}
                                                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-foreground text-background rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {guests.length > 3 && (
                                        <span className="text-sm font-medium text-muted-foreground">
                                            +{guests.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Guest Method & Reminder Row */}
                        <div className="flex items-end gap-4">
                            {/* Add guests method */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Add guests</label>
                                <div className="flex bg-muted/30 rounded-xl border border-border/50 p-1">
                                    <button
                                        type="button"
                                        onClick={() => setGuestMethod('email')}
                                        className={cn(
                                            "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                                            guestMethod === 'email'
                                                ? "bg-card text-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setGuestMethod('asana')}
                                        className={cn(
                                            "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                                            guestMethod === 'asana'
                                                ? "bg-card text-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Asana
                                    </button>
                                </div>
                            </div>

                            {/* Set reminder */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-2">Set reminder</label>
                                <div className="relative">
                                    <select
                                        value={reminder}
                                        onChange={(e) => setReminder(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-muted/30 border border-border/50 rounded-xl text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                                    >
                                        {REMINDER_OPTIONS.map((r) => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border/50" />

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 text-sm font-medium border border-border rounded-xl hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                            >
                                {isEditMode ? 'Save' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
