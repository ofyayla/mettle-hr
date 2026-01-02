import { X, Search } from 'lucide-react';


export interface PlannerFilters {
    title: string;
    status: string;
    attendees: string;
    date: string;
}

interface PlannerFilterPanelProps {
    filters: PlannerFilters;
    onFilterChange: (key: keyof PlannerFilters, value: string) => void;
    onClearFilters: () => void;
    onClose: () => void;
}

export function PlannerFilterPanel({ filters, onFilterChange, onClearFilters, onClose }: PlannerFilterPanelProps) {
    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 p-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Filters</h3>
                <div className="flex gap-2">
                    <button
                        onClick={onClearFilters}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {/* Title Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Title</label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                            type="text"
                            value={filters.title}
                            onChange={(e) => onFilterChange('title', e.target.value)}
                            placeholder="Filter by title..."
                            className="w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none appearance-none cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        <option value="meeting">Meetings</option>
                        <option value="task">Tasks</option>
                        <option value="research">Research</option>
                        <option value="reviews">Reviews</option>
                    </select>
                </div>

                {/* Attendees Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Guests</label>
                    <input
                        type="text"
                        value={filters.attendees}
                        onChange={(e) => onFilterChange('attendees', e.target.value)}
                        placeholder="Search guests..."
                        className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none"
                    />
                </div>

                {/* Date Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Date</label>
                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => onFilterChange('date', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
