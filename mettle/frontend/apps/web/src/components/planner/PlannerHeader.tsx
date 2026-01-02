import { useState, useRef, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlannerFilterPanel, PlannerFilters } from './PlannerFilterPanel';

type ViewMode = 'day' | 'week' | 'month';

interface PlannerHeaderProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onAddEvent: () => void;
    onToday: () => void;
    filters: PlannerFilters;
    onFilterChange: (key: keyof PlannerFilters, value: string) => void;
    onClearFilters: () => void;
}

export function PlannerHeader({
    viewMode,
    onViewModeChange,
    searchQuery,
    onSearchChange,
    onAddEvent,
    onToday,
    filters,
    onFilterChange,
    onClearFilters
}: PlannerHeaderProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    const viewModes: { value: ViewMode; label: string }[] = [
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-4">
            {/* Top Row: Title + View Switcher + Actions */}
            <div className="flex items-center justify-between">
                {/* Left: Title + Today Button + View Mode */}
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Planner</h1>

                    {/* Today Button */}
                    <button
                        onClick={onToday}
                        className="px-4 py-1.5 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                        Today
                    </button>

                    {/* View Mode Switcher */}
                    <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/50">
                        {viewModes.map((mode) => (
                            <button
                                key={mode.value}
                                onClick={() => onViewModeChange(mode.value)}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                                    viewMode === mode.value
                                        ? "bg-card text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {mode.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-48 pl-9 pr-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    {/* Filter Button with Dropdown */}
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={cn(
                                "flex items-center justify-center w-9 h-9 text-sm font-medium transition-colors border rounded-lg relative",
                                isFilterOpen || Object.values(filters).some(v => v && v !== 'all')
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "bg-muted/50 text-muted-foreground hover:text-foreground border-border/50"
                            )}
                            title="Filter events"
                        >
                            <Filter className="w-4 h-4" />
                            {Object.values(filters).some(v => v && v !== 'all') && (
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                            )}
                        </button>

                        {isFilterOpen && (
                            <PlannerFilterPanel
                                filters={filters}
                                onFilterChange={onFilterChange}
                                onClearFilters={onClearFilters}
                                onClose={() => setIsFilterOpen(false)}
                            />
                        )}
                    </div>

                    {/* Add Event Button */}
                    <button
                        onClick={onAddEvent}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Event
                    </button>
                </div>
            </div>
        </div>
    );
}
