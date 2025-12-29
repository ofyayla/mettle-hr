import { X, Search } from 'lucide-react';

interface Filters {
    title: string;
    location: string;
    minApplicants: string;
    maxApplicants: string;
    status: string;
    startDate: string;
    endDate: string;
}

interface JobsFilterPanelProps {
    filters: Filters;
    onFilterChange: (key: keyof Filters, value: string) => void;
    onClearFilters: () => void;
    onClose: () => void;
}

export function JobsFilterPanel({ filters, onFilterChange, onClearFilters, onClose }: JobsFilterPanelProps) {
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
                {/* Job Title Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Job Title</label>
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

                {/* Location Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Location</label>
                    <input
                        type="text"
                        value={filters.location}
                        onChange={(e) => onFilterChange('location', e.target.value)}
                        placeholder="e.g. Remote, New York"
                        className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none"
                    />
                </div>

                {/* Date Range Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Date Range</label>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => onFilterChange('startDate', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none"
                        />
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => onFilterChange('endDate', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none"
                        />
                    </div>
                </div>

                {/* Applicants Filter (Min-Max) */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Applicants</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={filters.minApplicants}
                            onChange={(e) => onFilterChange('minApplicants', e.target.value)}
                            placeholder="Min"
                            className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none"
                        />
                        <input
                            type="number"
                            value={filters.maxApplicants}
                            onChange={(e) => onFilterChange('maxApplicants', e.target.value)}
                            placeholder="Max"
                            className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/50 outline-none"
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
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="Draft">Draft</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
