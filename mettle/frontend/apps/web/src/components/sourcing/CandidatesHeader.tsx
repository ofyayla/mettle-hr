import { useState, useRef, useEffect } from 'react';
import { Plus, Search, Filter, LayoutGrid, List, Chrome as ChromeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CandidatesFilterPanel } from './CandidatesFilterPanel';

interface Filters {
    status: string;
    source: string;
    minScore: string;
    location: string;
    minExperience: string;
}

interface CandidatesHeaderProps {
    viewMode?: 'grid' | 'list';
    onViewChange?: (mode: 'grid' | 'list') => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    filters: Filters;
    onFilterChange: (key: keyof Filters, value: string) => void;
    onClearFilters: () => void;
    onAddCandidate?: () => void;
    totalCandidates: number;
}

export function CandidatesHeader({
    viewMode = 'grid',
    onViewChange,
    searchQuery = '',
    onSearchChange,
    filters,
    onFilterChange,
    onClearFilters,
    onAddCandidate,
    totalCandidates
}: CandidatesHeaderProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        }

        if (isFilterOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterOpen]);

    const hasActiveFilters =
        filters.status !== 'All' ||
        filters.source !== '' ||
        filters.minScore !== '' ||
        filters.location !== '' ||
        filters.minExperience !== '';

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8 z-20 relative">
            <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 flex items-center gap-2">
                    Candidates
                    <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/50">
                        {totalCandidates}
                    </span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Find, filter, and track your candidates.
                </p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto items-center flex-wrap sm:flex-nowrap">
                {/* View Toggle */}
                {onViewChange && (
                    <div className="bg-muted/50 p-1 rounded-md border border-border flex gap-1 mr-2 shrink-0">
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

                {/* Search */}
                <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        placeholder="Search..."
                        className="w-full sm:w-48 pl-9 pr-4 py-2 rounded-xl bg-background border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm placeholder:text-muted-foreground/70"
                    />
                </div>

                {/* Filter Button */}
                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={cn(
                            "p-2 rounded-xl border transition-all relative",
                            isFilterOpen || hasActiveFilters
                                ? "bg-primary/10 border-primary/50 text-primary"
                                : "bg-muted/50 hover:bg-muted border border-transparent hover:border-border/40 text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Filter className="w-4 h-4" />
                        {hasActiveFilters && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
                        )}
                    </button>

                    {isFilterOpen && (
                        <CandidatesFilterPanel
                            filters={filters}
                            onFilterChange={onFilterChange}
                            onClearFilters={() => {
                                onClearFilters();
                                // Optional: Keep open or close? Usually keep open to show cleared state or simply close.
                                // Let's keep it open for now as user might want to re-select.
                            }}
                            onClose={() => setIsFilterOpen(false)}
                        />
                    )}
                </div>

                {/* Chrome Extension Button */}
                <button
                    className="p-2 sm:px-4 sm:py-2 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted text-foreground transition-all group relative flex items-center gap-2"
                    title="Chrome Extension"
                >
                    <ChromeIcon className="w-4 h-4 text-blue-500" />
                    <span className="hidden lg:inline">Extension</span>
                    <div className="hidden group-hover:block absolute top-full mt-2 right-0 w-64 p-3 bg-popover border border-border rounded-lg shadow-xl z-50">
                        <p className="text-xs text-muted-foreground font-normal">
                            Add candidates from LinkedIn.
                        </p>
                    </div>
                </button>

                {/* Add Button */}
                <button
                    onClick={onAddCandidate}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/25 shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add</span>
                </button>
            </div>
        </div>
    );
}
