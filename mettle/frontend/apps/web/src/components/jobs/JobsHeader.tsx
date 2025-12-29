import { useState, useRef, useEffect } from 'react';
import { Plus, Search, Filter, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JobsFilterPanel } from './JobsFilterPanel';

interface Filters {
    title: string;
    location: string;
    minApplicants: string;
    maxApplicants: string;
    status: string;
    startDate: string;
    endDate: string;
}

interface JobsHeaderProps {
    viewMode?: 'grid' | 'list';
    onViewChange?: (mode: 'grid' | 'list') => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    filters: Filters;
    onFilterChange: (key: keyof Filters, value: string) => void;

    onClearFilters: () => void;
    onCreateJob?: () => void;
}

export function JobsHeader({
    viewMode = 'grid',
    onViewChange,
    searchQuery = '',
    onSearchChange,
    filters,
    onFilterChange,
    onClearFilters,
    onCreateJob
}: JobsHeaderProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        }

        function handleEscKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsFilterOpen(false);
            }
        }

        if (isFilterOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isFilterOpen]);

    // Check if any filter is active
    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8 z-20 relative">
            <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    Jobs
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your job postings and track applicant funnels.
                </p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto items-center">
                {/* View Toggle */}
                {onViewChange && (
                    <div className="bg-muted p-1 rounded-lg flex gap-1 mr-2">
                        <button
                            onClick={() => onViewChange('grid')}
                            className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onViewChange('list')}
                            className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        placeholder="Search jobs..."
                        className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl bg-background border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm placeholder:text-muted-foreground/70"
                    />
                </div>

                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={cn(
                            "p-2 rounded-xl border transition-all relative",
                            isFilterOpen || hasActiveFilters
                                ? "bg-primary/10 border-primary/50 text-primary"
                                : "border-border/50 hover:bg-muted/50 hover:border-border text-muted-foreground"
                        )}
                    >
                        <Filter className="w-4 h-4" />
                        {hasActiveFilters && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
                        )}
                    </button>

                    {isFilterOpen && (
                        <JobsFilterPanel
                            filters={filters}
                            onFilterChange={onFilterChange}
                            onClearFilters={() => {
                                onClearFilters();
                                setIsFilterOpen(false);
                            }}
                            onClose={() => setIsFilterOpen(false)}
                        />
                    )}
                </div>

                <button
                    onClick={onCreateJob}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/25"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Job</span>
                </button>
            </div>
        </div>
    );
}
